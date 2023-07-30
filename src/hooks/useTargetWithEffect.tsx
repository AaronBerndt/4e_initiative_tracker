import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { Duration, EffectProperty } from "../../types";

type MutateProps = {
  effectProperties: EffectProperty[];
  duration: Duration;
  effecterId: string;
  source: string;
  effecterName: string;
  affterEffectProperties?: EffectProperty[];
};

export default function useTargetWithEffect() {
  const queryClient = useQueryClient();
  return useMutation((mutateProps: MutateProps) =>
    axios.post("/api/targetWithEffect", {
      data: mutateProps,
    })
  );
}
