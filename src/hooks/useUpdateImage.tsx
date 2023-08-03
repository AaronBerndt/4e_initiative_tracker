import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type MutateProps = {
  _id: string;
  combatId: string;
  imageUrl: string;
};

export default function useUpdateImage() {
  return useMutation((mutateProps: MutateProps) =>
    // axios.post("https://4e-pwa.vercel.app/api/updateCombatantImage", {
    axios.post("https://localhost:3000/api/updateCombatantImage", {
      data: mutateProps,
    })
  );
}
