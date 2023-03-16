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
} from "@mui/material";
import { useEffect, useState } from "react";
import { find, range } from "lodash";
import { GiDeathSkull } from "react-icons/gi";
import { useCombat } from "../hooks/useCombat";
import { usePusherContext } from "../context/PusherContext";

type Props = {
  combat: any;
};
export default function InitiativeList({ combat }: Props) {
  const [items, setItems] = useState(range(combat.initiativeOrder.length));

  useEffect(() => {
    setItems(range(combat.initiativeOrder.length));
  }, [combat.initiativeOrder]);

  const { refetch } = useCombat(combat._id);
  const { channel } = usePusherContext();

  if (!items) {
    return <Skeleton />;
  }

  return (
    <Card>
      <CardContent>
        <List>
          {items.map((item: string) => {
            let damage;
            let temporaryHitpoints;
            const combatant = find(combat.combatants, {
              _id: combat.initiativeOrder[item]?.combatantId,
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
                console.log(data);
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
              <ListItem divider disablePadding>
                <ListItemButton
                  selected={combat.currentInitiativeOrderIndex === item}
                >
                  <ListItemAvatar>
                    {combat.initiativeOrder[item]?.initiativeResult}
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
                        {combat.initiativeOrder[item]?.combatant}
                      </Stack>
                    }
                    secondary={
                      combat.isPlayerView && !combatant.playerId ? (
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
                              {range(characterState.deathSaves).map((i) => (
                                <GiDeathSkull
                                  key={i}
                                  style={{ color: "black" }}
                                />
                              ))}
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
      </CardContent>
    </Card>
  );
}
