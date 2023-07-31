import OBR, { buildImage } from "@owlbear-rodeo/sdk";
import { find } from "lodash";

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

  combatants.forEach((combatant: any) => {
    const returnItemUrl = () => {
      let url = "";
      if (combatant.monsterImageId || combatant.characterImageId) {
        url = combatant.monsterImageId
          ? combatant.monsterImageId
          : combatant.playerImageId;
      }
      return url;
    };

    if (!find(currentTokens, { id: combatant._id })) {
      const item = buildImage(
        {
          height: 300,
          width: 300,
          url: "blob:https://www.owlbear.app/2fad3bc2-0ba4-4693-8b88-7050ed8f77c8",
          mime: "image/png",
        },
        { dpi: 300, offset: { x: 150, y: 150 } }
      )
        .id(`${combatant._id}`)
        .position({ x: 1000, y: 1000 })
        .layer("CHARACTER")
        .plainText(combatant.name)
        .build();
      OBR.scene.items.addItems([item]);
    }
  });
}
