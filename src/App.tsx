import { useState } from "react";
import OBR, { buildImage } from "@owlbear-rodeo/sdk";
import "./App.css";
import { useCombat } from "./hooks/useCombat";
import {
  Button,
  Card,
  CardContent,
  LinearProgress,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InitiativeList from "./components/InitiativeList";
import usePusher from "./hooks/usePusher";
import { stringObject } from "./constants/strings";

function App() {
  const strings = stringObject.FetchCombatCard;
  const [combatId, setCombatId] = useState("");
  const { data: combatData, isLoading, refetch } = useCombat(combatId);
  usePusher(combatId);

  const onFetchCombatData = async () => {
    refetch();
  };

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
        {combatData && (
          <>
            <Typography>{combatData._id}</Typography>
            <InitiativeList combat={combatData} />
          </>
        )}
      </Stack>

      <Card>
        <CardContent>
          <TextField
            label={strings.CombatIdTextFieldLabel}
            fullWidth
            value={combatId}
            onChange={(e) => setCombatId(e.target.value)}
          />
          <Button fullWidth onClick={onFetchCombatData} variant="contained">
            {strings.FetchCombatButtonLabel}
          </Button>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default App;
