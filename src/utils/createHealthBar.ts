import OBR, {
  Item,
  buildShape,
  buildText,
  ShapeType,
} from "@owlbear-rodeo/sdk";
import { FONT } from "./constants";

const getImageBounds = (item: any, dpi: number) => {
  const dpiScale = dpi / item.grid.dpi;
  const width = item.image.width * dpiScale * item.scale.x;
  const height = item.image.height * dpiScale * item.scale.y;
  return { width, height };
};

async function createHealthBar(item: Item, combatant: any) {
  let damage;
  let temporaryHitpoints;

  if (combatant?.monsterState) {
    damage = combatant?.monsterState?.damage;
    temporaryHitpoints = combatant?.monsterState?.temporaryHitpoints;
  } else {
    damage = combatant.characterState?.damage;
    temporaryHitpoints = combatant.characterState?.temporaryHitpoints;
  }

  const maxHealth = combatant.hitpoints;
  const health = combatant.hitpoints - damage;
  const barPadding = 2;
  const dpi = await OBR.scene.grid.getDpi();
  const bounds = getImageBounds(item, dpi);
  bounds.width = Math.abs(bounds.width);
  bounds.height = Math.abs(bounds.height);

  let healthBackgroundColor = "#A4A4A4";
  const setVisibilityProperty = item.visible;
  const backgroundOpacity = 0.6;
  const healthOpacity = 0.5;
  const diameter = 30;
  const circleFontSize = diameter - 8;
  var verticalOffset: any = 0;
  const textVerticalOffset = 1.5;
  const barHeight = 20;
  let alignBottomMultiplier: number = 1;
  let origin = {
    x: item.position.x,
    y:
      item.position.y +
      (alignBottomMultiplier * bounds.height) / 2 -
      verticalOffset,
  };

  const position = {
    x: origin.x - bounds.width / 2 + barPadding,
    y: origin.y - barHeight - 2,
  };
  const barWidth = bounds.width - barPadding * 2;

  const barFontSize = circleFontSize;
  const barTextHeight = barHeight + 0;

  const backgroundShape = buildShape()
    .width(barWidth)
    .height(barHeight)
    .shapeType("RECTANGLE")
    .fillColor(healthBackgroundColor)
    .fillOpacity(backgroundOpacity)
    .strokeWidth(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(item.id + "health-background")
    .visible(setVisibilityProperty)
    .disableHit(true)
    .build();

  let healthPercentage = 0;

  if (health <= 0) {
    healthPercentage = 0;
  } else if (health < maxHealth) {
    healthPercentage = health / maxHealth;
  } else if (health >= maxHealth) {
    healthPercentage = 1;
  } else {
    healthPercentage = 0;
  }

  const healthShape = buildShape()
    .width(healthPercentage === 0 ? 0 : barWidth * healthPercentage)
    .height(barHeight)
    .shapeType("RECTANGLE")
    .fillColor("red")
    .fillOpacity(healthOpacity)
    .strokeWidth(0)
    .strokeOpacity(0)
    .position({ x: position.x, y: position.y })
    .attachedTo(item.id)
    .layer("ATTACHMENT")
    .locked(true)
    .id(item.id + "health")
    .visible(setVisibilityProperty)
    .disableHit(true)
    .build();

  const healthText = buildText()
    .position({ x: position.x, y: position.y + textVerticalOffset })
    .plainText(
      temporaryHitpoints !== 0
        ? "" +
            health +
            String.fromCharCode(0x2215) +
            maxHealth +
            `(${temporaryHitpoints})`
        : "" + health + String.fromCharCode(0x2215) + maxHealth
    )
    .textAlign("CENTER")
    .textAlignVertical("MIDDLE")
    .fontSize(barFontSize)
    .fontFamily(FONT)
    .textType("PLAIN")
    .height(barTextHeight)
    .width(barWidth)
    .fontWeight(400)
    .attachedTo(item.id)
    .fillOpacity(1)
    .layer("TEXT")
    .locked(true)
    .id(item.id + "health-label")
    .visible(setVisibilityProperty)
    .disableHit(true)
    .build();

  return [backgroundShape, healthShape, healthText];
}

export default createHealthBar;
