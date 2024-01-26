import OBR, { Item, buildShape, buildText } from "@owlbear-rodeo/sdk";
import { FONT } from "./constants";

const getImageBounds = (item: any, dpi: number) => {
  const dpiScale = dpi / item.grid.dpi;
  const width = item.image.width * dpiScale * item.scale.x;
  const height = item.image.height * dpiScale * item.scale.y;
  return { width, height };
};

type DefenseType = "AC" | "Fortitude" | "Reflex" | "Will";

export const createDefenseToken = async (
  item: Item,
  combatant: any,
  defenseType: DefenseType
) => {
  const colorObject: any = {
    ac: "cornflowerblue",
    fortitude: "olivedrab",
    reflex: "red",
    will: "purple",
  };

  const color = colorObject[defenseType.toLowerCase()];
  const dpi = await OBR.scene.grid.getDpi();
  const bounds = getImageBounds(item, dpi);
  bounds.width = Math.abs(bounds.width);
  bounds.height = Math.abs(bounds.height);

  const diameter = 30;
  const circleFontSize = diameter - 8;
  const circleTextHeight = diameter + 0;
  const textVerticalOffset = 1.5;
  const barHeight = 20;
  const bubbleOpacity = 0.6;
  var verticalOffset: any = 0;
  let alignBottomMultiplier: number = 1;
  let offsetBubbles = 0;

  let origin = {
    x: item.position.x,
    y:
      item.position.y +
      (alignBottomMultiplier * bounds.height) / 2 -
      verticalOffset,
  };

  let originObject = {
    ac: {
      x: item.position.x,
      y:
        item.position.y +
        (alignBottomMultiplier * bounds.height) / 2 -
        verticalOffset,
    },
    fort: {
      x: origin.x + bounds.width / 2 - (diameter * 3) / 2 - 4,
      y: origin.y - diameter / 2 - 4 - barHeight * offsetBubbles,
    },
    reflex: {
      x: origin.x + bounds.width / 2 - (diameter * 3) / 2 - 4,
      y: origin.y - diameter / 2 - 4 - barHeight * offsetBubbles,
    },
    will: {
      x: origin.x + bounds.width / 2 - (diameter * 3) / 2 - 4,
      y: origin.y - diameter / 2 - 4 - barHeight * offsetBubbles,
    },
  };

  // if (defenseType === "fort") {
  //   origin = originObject.fort;
  // }
  // if (defenseType === "reflex") {
  //   origin = originObject.reflex;
  // }
  // if (defenseType === "will") {
  //   origin = originObject.will;
  // }

  let armorPosition;
  armorPosition = {
    x: origin.x + bounds.width / 2 - diameter / 2 - 2,
    y: origin.y - diameter / 2 - 4 - barHeight * offsetBubbles,
  };

  const setVisibilityProperty = item.visible;

  const returnDefenseValue = (defenseType: DefenseType) => {
    let value = 0;
    if (combatant.playerId) {
      value = combatant.defenses[defenseType];
    } else {
      const defenseTypeObject: any = {
        ac: "armorClass",
        fortitude: "fortitude",
        reflex: "reflex",
        will: "will",
      };

      value = combatant[defenseTypeObject[defenseType.toLowerCase()]];
    }

    return value;
  };

  const defenseShape = buildShape()
    .width(bounds.width)
    .height(diameter)
    .shapeType("CIRCLE")
    .fillColor(color)
    .fillOpacity(bubbleOpacity)
    .strokeColor(color)
    .strokeOpacity(0.5)
    .strokeWidth(0)
    .position(
      defenseType === "AC"
        ? { x: armorPosition.x, y: armorPosition.y }
        : { x: armorPosition.x, y: armorPosition.y }
    )
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(`${combatant._id}` + `${defenseType}-background`)
    .build();

  const defenseText = buildText()
    .position({
      x: armorPosition.x - diameter / 2 - 0.5,
      y: armorPosition.y - diameter / 2 + textVerticalOffset,
    })
    .plainText("" + returnDefenseValue(defenseType))
    .textAlign("CENTER")
    .textAlignVertical("MIDDLE")
    .fontSize(circleFontSize)
    .fontFamily(FONT)
    .textType("PLAIN")
    .height(circleTextHeight)
    .width(diameter)
    .fontWeight(400)
    .attachedTo(item.id)
    .layer("TEXT")
    .locked(true)
    .id(item.id + `${defenseType}-label`)
    .visible(setVisibilityProperty)
    .disableHit(true)
    .build();

  return [defenseShape, defenseText];
};
