import { Card, CardHeader, Grid } from "@mui/material";
import parse from "html-react-parser";
import { useCombat } from "../hooks/useCombat";
import { MonsterHealthWorkspaceModal } from "./MonsterHealthWorkspace";

type Props = {
  currentCombatant: any;
  combatId: string;
};
export function DisplayCard({ currentCombatant, combatId }: Props) {
  const { data } = useCombat(combatId);
  return (
    <Card>
      <CardHeader title={currentCombatant?.name} />
      <Grid>
        <MonsterHealthWorkspaceModal
          hitpoints={currentCombatant.hitpoints}
          monsterState={currentCombatant.monsterState}
          _id={currentCombatant._id}
          combatId={combatId}
        />
      </Grid>
    </Card>
  );
}
