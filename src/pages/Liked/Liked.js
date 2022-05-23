import { useAuthContext } from "../../hooks/useAuthContext";
import CollectionResults from "../../components/CollectionResults/CollectionResults";

export default function Liked({ scrollRef }) {
  const { user } = useAuthContext();

  const query = [
    ["likes", "music"],
    [
      ["__name__", "==", user.uid],
      ["docID", "in"],
    ],
    "likes",
  ];

  return <CollectionResults scrollRef={scrollRef} query={query} />;
}
