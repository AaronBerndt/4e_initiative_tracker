import { useState } from "react";
import { range } from "lodash";
import styled from "styled-components";

import { GiDeathSkull } from "react-icons/gi";
import React from "react";
import { CharacterState } from "../../types";
import useUpdateMonsterHitpoints from "../hooks/useUpdateMonsterHitpoints";
import useToggle from "../hooks/useToggleOpen";
import { HealthWorkSpace } from "./Spaces";
import { useCombat } from "../hooks/useCombat";
import {
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  ButtonGroup,
  DialogActions,
} from "@mui/material";

type Props = {
  hitpoints: number;
  monsterState: CharacterState;
  _id: string;
  combatId: string;
};

const HealingButton = styled(Button)`
  background: #40d250;
  color: white;
`;

const DamageButton = styled(Button)`
  background: #c53131;
  color: white;
`;

const TemporaryHitPointsButton = styled(Button)`
  background: #d3d3d3;
  color: white;
`;

export function MonsterHealthWorkspaceModal({
  hitpoints,
  monsterState,
  _id,
  combatId,
}: Props) {
  const hitpointsRemaining = hitpoints - monsterState.damage;
  const { data } = useCombat(combatId);
  const { open, toggleOpen } = useToggle();
  const [value, setValue] = useState(0);
  const { mutate: updateMonsterHitPoints } = useUpdateMonsterHitpoints();

  const onClick = (type: any, surgeValue?: number) =>
    updateMonsterHitPoints({
      healthChangeAmount: value,
      _id,
      type,
      hitpoints,
      combatId,
    });

  return (
    <>
      <Button
        onClick={toggleOpen}
        variant="contained"
        size="small"
        style={{
          background:
            hitpoints - hitpointsRemaining >= hitpoints / 2 ? "red" : "",
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={0}
        >
          <span>
            {hitpointsRemaining} / {hitpoints}
            {monsterState.temporaryHitpoints
              ? ` (${monsterState.temporaryHitpoints})`
              : null}
          </span>
          <span>Hit Points</span>
          <Stack direction="row" spacing={1}>
            {range(monsterState.deathSaves).map((i) => (
              <GiDeathSkull key={i} />
            ))}
          </Stack>
        </Stack>
      </Button>
      <Dialog open={open}>
        <DialogTitle>Health Workspace</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <HealthWorkSpace
              hitpointsRemaining={hitpointsRemaining}
              temporaryHitpoints={monsterState.temporaryHitpoints}
              hitpoints={hitpoints}
              surges={0}
            />

            <TextField
              type="number"
              defaultValue={value}
              onChange={(e: any) => setValue(e.target.value)}
            />

            <ButtonGroup fullWidth>
              <HealingButton
                variant="contained"
                onClick={() => onClick("heal")}
              >
                Heal
              </HealingButton>
              <DamageButton
                variant="contained"
                onClick={() => onClick("damage")}
              >
                Damage
              </DamageButton>
            </ButtonGroup>
            <TemporaryHitPointsButton
              variant="contained"
              onClick={() => onClick("add temporary hitpoints")}
            >
              Add Temp Hitpoints
            </TemporaryHitPointsButton>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={toggleOpen}
            fullWidth
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
