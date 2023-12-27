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
import { find } from "lodash";
import { DisplayCard } from "./components/DisplayCard";

function App() {
  const strings = stringObject.FetchCombatCard;
  const items = window.location.pathname.split("/");
  const COMBATANT_ID = items[2];

  const [combatId, setCombatId] = useState("");
  const [ready, setReady] = useState(false);
  const { data: combats, isLoading } = useCombats();
  const [currentSelectedCombatant, setCurrentSelectedCombtant] = useState<any>(
    COMBATANT_ID ? COMBATANT_ID : null
  );

  const fetchCombatIdFromMetadata = async () => {
    const metadata = await OBR.room.getMetadata();

    if (metadata.combatId !== "") {
      setCombatId(metadata.combatId as string);
    }
  };
  usePusher(combatId);

  useEffect(() => {
    if (OBR.isAvailable && !OBR.isReady) {
      OBR.onReady(() => setReady(true));
    }

    if (OBR.isReady && combatId) {
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
            OBR.popover.open({
              id: "4eCombatantDetails/popover",
              url: `/${combatId}/${id}`,
              height: 500,
              width: 500,
              anchorElementId: id,
            });
          },
        });
      });
    }

    if (!combatId) {
      fetchCombatIdFromMetadata();
    }
  }, [combatId, ready]);

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
              <ListItemButton
                onClick={() => {
                  OBR.room.setMetadata({ combatId: _id });
                  setCombatId(_id);
                }}
              >
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
