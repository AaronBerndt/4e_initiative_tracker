import OBR, { buildImage } from "@owlbear-rodeo/sdk";
import { find } from "lodash";
import { createDefenseToken } from "./createDefenseToken";
import createHealthBar from "./createHealthBar";

export async function removeTokens(combatants: any) {
  const currentTokens = await OBR.scene.items.getItems();
  currentTokens
    .filter(({ layer }: any) => layer === "CHARACTER")
    .forEach(({ id }: any) => {
      if (!find(combatants, { _id: id })) {
        OBR.scene.items.deleteItems([id]);
      }
    });
}

export async function addTokens(combatants: any) {
  const currentTokens = await OBR.scene.items.getItems();

  combatants.forEach(async ({ name, _id, ...rest }: any) => {
    if (!find(currentTokens, { id: _id })) {
      console.log(rest);
      const item = buildImage(
        {
          height: 300,
          width: 300,
          url: "blob:https://www.owlbear.app/2fad3bc2-0ba4-4693-8b88-7050ed8f77c8",
          mime: "image/png",
        },
        { dpi: 300, offset: { x: 150, y: 150 } }
      )
        .id(`${_id}`)
        .position({ x: 1000, y: 1000 })
        .layer("CHARACTER")
        // .plainText(name)
        .build();

      const [armorClassShape, armorClassText] = await createDefenseToken(
        item,
        {
          _id,
          ...rest,
        },
        "ac"
      );

      const healthBarItems = await createHealthBar(item, { _id, ...rest });

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

      OBR.scene.items.addItems([
        item,
        armorClassShape,
        armorClassText,
        // fortShape,
        // fortText,
        // reflexShape,
        // reflexText,
        // willShape,
        // willText,
        ...healthBarItems,
      ]);
    }
  });
}
