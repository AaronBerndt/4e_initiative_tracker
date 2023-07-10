import { useEffect, useState } from "react";
import "./App.css";
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import InitiativeList from "./components/InitiativeList";
import usePusher from "./hooks/usePusher";
import { stringObject } from "./constants/strings";
import useCombats from "./hooks/useCombat";
import OBR from "@owlbear-rodeo/sdk";
import parse from "html-react-parser";
import { find } from "lodash";
import { DisplayCard } from "./components/DisplayCard";

function App() {
  const strings = stringObject.FetchCombatCard;
  const [combatId, setCombatId] = useState("");
  const { data: combats, isLoading } = useCombats();
  const [currentSelectedCombatant, setCurrentSelectedCombtant] = useState(null);
  // usePusher(combatId);

  console.log(combatId);
  console.log(combats);

  useEffect(() => {
    console.log(combatId);
    if (combatId) {
      OBR.onReady(() => {
        OBR.contextMenu.create({
          id: `4eCombatantDetails`,
          icons: [
            {
              icon: "/power.svg",
              label: "Combatant Details",
              filter: {
                every: [{ key: "layer", value: "CHARACTER" }],
                permissions: ["UPDATE"],
              },
            },
          ],
          async onClick(context, elementId) {
            const [{ id, position, scale }] = context.items;
            console.log(combatId);
            const { combatants } = find(combats, { _id: combatId });
            console.log(combatants);
            const currentCombatant = find(combatants, { _id: id });
            console.log(currentCombatant);
            setCurrentSelectedCombtant(currentCombatant);
            // OBR.popover.open({
            //   id: "combatantdetails",
            //   url: `/Test`,
            //   height: 600,
            //   width: 200,
            //   anchorOrigin: { horizontal: "LEFT", vertical: "CENTER" },
            // });
            // }
          },
        });
      });
    }
  }, [combatId]);

  if (currentSelectedCombatant && combatId) {
    return (
      <>
        {combatId ? (
          <DisplayCard
            currentCombatant={currentSelectedCombatant}
            combatId={combatId}
          />
        ) : null}
      </>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack>
        {combatId !== "" && (
          <>
            <Typography>{combatId}</Typography>
            <InitiativeList combatId={combatId} />
          </>
        )}
      </Stack>

      <Card>
        <CardContent>
          <List>
            {combats.map(({ _id }: any) => (
              <ListItemButton onClick={() => setCombatId(_id)}>
                {_id}
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default App;
