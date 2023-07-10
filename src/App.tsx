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
  const items = window.location.pathname.split("/");
  const COMBAT_ID = items[1];
  const COMBATANT_ID = items[2];

  const [combatId, setCombatId] = useState(COMBAT_ID ? COMBAT_ID : "");
  const { data: combats, isLoading } = useCombats();
  const [currentSelectedCombatant, setCurrentSelectedCombtant] = useState<any>(
    COMBATANT_ID ? COMBATANT_ID : null
  );
  usePusher(combatId);

  useEffect(() => {
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
            const [{ id }] = context.items;
            setCurrentSelectedCombtant(id);
          },
        });
      });
    }
  }, [combatId]);

  if (currentSelectedCombatant && combatId && !isLoading) {
    const { combatants } = find(combats, { _id: combatId });
    const currentCombatant = find(combatants, {
      _id: currentSelectedCombatant,
    });

    return (
      <>
        {combatId ? (
          <DisplayCard
            currentCombatant={currentCombatant}
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
