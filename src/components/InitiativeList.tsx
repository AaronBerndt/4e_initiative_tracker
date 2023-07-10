import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Skeleton,
  CardHeader,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { find, range } from "lodash";
import { GiDeathSkull } from "react-icons/gi";
import { useCombat } from "../hooks/useCombat";
import { usePusherContext } from "../context/PusherContext";
import { stringObject } from "../constants/strings";
import OBR from "@owlbear-rodeo/sdk";

type Props = {
  combatId: string;
  combatData: any;
};
export default function InitiativeList({ combatId }: any) {
  const { data: combatData, isLoading } = useCombat(combatId);

  if (!isLoading && combatData) {
    return (
      <InitiativeListContent combatId={combatId} combatData={combatData} />
    );
  }

  return <Skeleton />;
}

function InitiativeListContent({ combatId, combatData }: Props) {
  const strings = stringObject.InitiativeList;
  const { refetch } = useCombat(combatId);

  const [items, setItems] = useState(range(combatData.initiativeOrder.length));

  useEffect(() => {
    setItems(range(combatData.initiativeOrder.length));
  }, [combatData.initiativeOrder]);

  const { channel } = usePusherContext();

  if (!items) {
    return <Skeleton />;
  }

  return (
    <Card>
      <CardHeader title={strings.CurrentRoundHeader(combatData.currentRound)} />
      <CardHeader title={strings.EscalationDieHeader("0")} />
      <CardContent>
        <List>
          {items.map((item: any) => {
            let damage;
            let temporaryHitpoints;
            const combatant = find(combatData.combatants, {
              _id: combatData.initiativeOrder[item]?.combatantId,
            });

            if (!combatant) {
              return null;
            }

            channel.bind(
              `Targeted with attack ${combatant._id}`,
              (data: any) => {
                refetch();
              }
            );

            channel.bind(
              `Targeted with damage ${combatant._id}`,
              (data: any) => {
                refetch();
              }
            );
            channel.bind(
              `Targeted with healing ${combatant._id}`,
              (data: any) => {
                refetch();
              }
            );
            channel.bind(
              `Targeted with effect ${combatant._id}`,
              (data: any) => {
                refetch();
              }
            );

            const { hitpoints, monsterState, characterState } = combatant;

            if (monsterState) {
              damage = monsterState?.damage;
              temporaryHitpoints = monsterState?.temporaryHitpoints;
            } else {
              damage = characterState?.damage;
              temporaryHitpoints = characterState?.temporaryHitpoints;
            }

            const hitpointsRemaining = hitpoints - damage;

            return (
              <ListItem divider disablePadding key={item}>
                <ListItemButton
                  selected={combatData.currentInitiativeOrderIndex === item}
                  onClick={() => {
                    OBR.popover.open({
                      id: "4eCombatantDetails/popover",
                      url: `/${combatId}/${combatData.initiativeOrder[item].combatantId}`,
                      height: 500,
                      width: 500,
                      anchorElementId: combatData.initiativeOrder[item]._id,
                    });
                  }}
                >
                  <ListItemAvatar>
                    {combatData.initiativeOrder[item]?.initiativeResult}
                  </ListItemAvatar>
                  <ListItemText
                    secondaryTypographyProps={{
                      style: {
                        color:
                          hitpointsRemaining / hitpoints <= 0
                            ? "gray"
                            : hitpointsRemaining / hitpoints <= 0.5
                            ? "red"
                            : "green",
                      },
                    }}
                    primary={
                      <Stack direction="row" spacing={10}>
                        {combatData.initiativeOrder[item]?.combatant}
                      </Stack>
                    }
                    secondary={
                      combatData.isPlayerView && !combatant.playerId ? (
                        hitpointsRemaining / hitpoints <= 0 ? (
                          "Dead"
                        ) : hitpointsRemaining / hitpoints <= 0.5 ? (
                          "Bloodied"
                        ) : (
                          "Healthy"
                        )
                      ) : (
                        <>
                          <span>
                            {hitpointsRemaining} / {hitpoints}
                            {temporaryHitpoints
                              ? ` (${temporaryHitpoints})`
                              : null}
                          </span>
                          {combatant.playerId && (
                            <Stack direction="row" spacing={1}>
                              {range(characterState.deathSaves).map(
                                (i: number) => (
                                  <GiDeathSkull
                                    key={i}
                                    style={{ color: "black" }}
                                  />
                                )
                              )}
                            </Stack>
                          )}
                        </>
                      )
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Button onClick={() => refetch()}>Refresh</Button>
      </CardContent>
    </Card>
  );
}
