import { useAuthContext } from "../../hooks/useAuthContext";
import CollectionResults from "../../components/CollectionResults/CollectionResults";
import OneColumnLayout from "../../components/Layout/OneColumnLayout";

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

  return (
    <OneColumnLayout user={user}>
      <CollectionResults
        scrollRef={scrollRef}
        query={query}
        hideActionBar={true}
      />
    </OneColumnLayout>
  );
}
