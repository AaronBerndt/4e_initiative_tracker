import { Button, ButtonGroup, Card, CardHeader, Grid } from "@mui/material";
import parse from "html-react-parser";
import { useState } from "react";
import { useCombat } from "../hooks/useCombat";
import { MonsterHealthWorkspaceModal } from "./MonsterHealthWorkspace";

type Props = {
  currentCombatant: any;
  combatId: string;
};
export function DisplayCard({ currentCombatant, combatId }: Props) {
  const { data } = useCombat(combatId);
  const [currentView, setCurrentView] = useState("Main");
  return (
    <Card>
      <CardHeader title={currentCombatant?.name} />
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      >
        <Button
          onClick={() => setCurrentView("Main")}
          color={currentView === "Main" ? "primary" : "secondary"}
        >
          Main View
        </Button>
        <Button
          onClick={() => setCurrentView("HTML")}
          color={currentView === "HTML" ? "primary" : "secondary"}
        >
          HTML
        </Button>
      </ButtonGroup>
      {currentView === "Main" ? (
        <Grid>
          <MonsterHealthWorkspaceModal
            hitpoints={currentCombatant.hitpoints}
            monsterState={currentCombatant.monsterState}
            _id={currentCombatant._id}
            combatId={combatId}
          />
        </Grid>
      ) : (
        <Grid>{parse(currentCombatant.html)}</Grid>
      )}
    </Card>
  );
}
