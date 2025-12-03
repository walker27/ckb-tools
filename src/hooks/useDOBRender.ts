import { getSporeImg } from "@/utils/spore";
import { useQuery } from "@tanstack/react-query";


type Config = {
  type: string;
  data: string;
  id: string;
}

export default function useDOBRender({ type, data, id }: Config) {
  const isDOBImage = type === 'dob' && !!data && !!id;

  const { data: dobRenderImage, isLoading } = useQuery({
    queryKey: ['dob_render_img', id],
    queryFn: () => getSporeImg({ id, data }),
    enabled: !!isDOBImage,
  })
  return {
    data: dobRenderImage,
    isLoading
  }
}