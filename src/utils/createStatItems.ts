import { Item } from "@owlbear-rodeo/sdk";
import { createDefenseToken } from "./createDefenseToken";
import createHealthBar from "./createHealthBar";

export default async function createStatItems(item: Item, combatant: any) {
  const [armorClassShape, armorClassText] = await createDefenseToken(
    item,
    combatant,
    "AC"
  );

  const healthBarItems = await createHealthBar(item, combatant);

  // const [fortShape, fortText] = await createDefenseToken(
  //   item,
  //   {
  //     _id,
  //     ...rest,
  //   },
  //   "fort"
  // );

  // const [reflexShape, reflexText] = await createDefenseToken(
  //   item,
  //   {
  //     _id,
  //     ...rest,
  //   },
  //   "reflex"
  // );

  // const [willShape, willText] = await createDefenseToken(
  //   item,
  //   {
  //     _id,
  //     ...rest,
  //   },
  //   "will"
  // );
  //
  //
  return [...healthBarItems, armorClassShape, armorClassText];
}
