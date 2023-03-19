import { useState } from "react";
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

function App() {
  const strings = stringObject.FetchCombatCard;
  const [combatId, setCombatId] = useState("");
  const { data: combats, isLoading } = useCombats();
  usePusher(combatId);

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
