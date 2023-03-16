import { useEffect, useState } from "react";
import OBR, { buildImage, buildShape, isImage } from "@owlbear-rodeo/sdk";
import "./App.css";
import { useCombat } from "./hooks/useCombat";
import {
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InitiativeList from "./components/InitiativeList";

function App() {
  const [combatId, setCombatId] = useState("");
  const { data: combatData, isLoading, refetch } = useCombat(combatId);

  const onFetchCombatData = async () => {
    // const characters = await OBR.scene.items.getItems();
    // console.log(characters);

    // OBR.scene.items.deleteItems(["c889dd71-a9a9-40b1-9a45-ba0373ea3c08"]);
    refetch();
  };

  const onClick = async () => {
    const roomId = await OBR.room.id;

    combatData.combatants
      .filter((combatant: any) => combatant)
      .forEach((combatant: any) => {
        const item = buildImage(
          {
            height: 300,
            width: 300,
            url: "https://e7.pngegg.com/pngimages/602/387/png-clipart-goblin-goblin.png",
            mime: "image/png",
          },
          { dpi: 300, offset: { x: 150, y: 150 } }
        )
          .id(combatant._id)
          .plainText(combatant.name)
          .build();
        OBR.scene.items.addItems([item]);
      });

    const characters = await OBR.scene.items.getItems();
  };

  if (isLoading) {
    return (
      <Card>
        <LinearProgress />;
      </Card>
    );
  }

  return (
    <Stack>
      {combatData && (
        <>
          <Typography>{combatData._id}</Typography>
          <InitiativeList combat={combatData} />

          <Button fullWidth onClick={onClick} variant="contained">
            Add Characters to battle
          </Button>

          <Button fullWidth onClick={onClick} variant="contained">
            Update Combat
          </Button>
        </>
      )}
      <Card>
        <CardContent>
          <TextField
            label="Enter Combat Id"
            fullWidth
            value={combatId}
            onChange={(e) => setCombatId(e.target.value)}
          />
          <Button fullWidth onClick={onFetchCombatData} variant="contained">
            Fetch Combat
          </Button>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default App;
