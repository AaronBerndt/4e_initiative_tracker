import { Stack } from "@mui/material";
import styled from "styled-components";

type DefenesesSpaceProps = {
  defenses: {
    AC: number;
    Fortitude: number;
    Reflex: number;
    Will: number;
  };
  speed: number;
};

type OtherSpacesProps = {
  speed: number;
  initiative: number;
  actionPoints: number;
};

type HealWorkSpaceProps = {
  hitpoints: number;
  hitpointsRemaining: number;
  temporaryHitpoints: number;
  surges: number;
};

const Div = styled.div`
  position: relative;
  cursor: pointer;
  text-align: center;
  margin-right: 10px;
`;

const AttributeValue = styled.div`
  font-size: 20px;
  font-weight: 500;
  line-height: 27px;
  color: ${(props) => props.color};
`;
const AttributeFooter = styled.div`
  font-size: 12px;
`;

const AttributeHeader = styled.div`
  font-size: 20px;
`;

export function DefenesesSpace({ defenses, speed }: DefenesesSpaceProps) {
  const nameObject: any = {
    AC: "AC",
    Fortitude: "Fort",
    Reflex: "Ref",
    Will: "Will",
  };
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="row">
        {Object.entries(defenses).map(([NAME, VALUE]) => (
          <Div key={NAME}>
            <AttributeValue>{VALUE}</AttributeValue>
            <AttributeHeader>{nameObject[NAME]}</AttributeHeader>
          </Div>
        ))}
      </Stack>
      <Div>
        <AttributeValue>Speed</AttributeValue>
        <AttributeHeader>{speed}</AttributeHeader>
      </Div>
    </Stack>
  );
}

export function OtherSpaces({
  speed,
  initiative,
  actionPoints,
}: OtherSpacesProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      {Object.entries({
        speed,
        initiative,
        actionPoints,
      }).map(([NAME, VALUE]) => (
        <Div key={NAME}>
          <AttributeValue>{VALUE}</AttributeValue>
          <AttributeHeader>{NAME}</AttributeHeader>
        </Div>
      ))}
    </Stack>
  );
}

export function HealthWorkSpace({
  hitpointsRemaining,
  temporaryHitpoints,
  surges,
  hitpoints,
}: HealWorkSpaceProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      {Object.entries({
        "Current HP": hitpointsRemaining,
        "Max HP": hitpoints,
        "Temp HP": temporaryHitpoints,
        "Surges Remaining": surges,
      }).map(([NAME, VALUE]) => (
        <Div key={NAME}>
          <AttributeValue>{VALUE}</AttributeValue>
          <AttributeHeader>{NAME}</AttributeHeader>
        </Div>
      ))}
    </Stack>
  );
}
