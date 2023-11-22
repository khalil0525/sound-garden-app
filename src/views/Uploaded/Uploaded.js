import { useAuthContext } from '../../hooks/useAuthContext';
//
import CollectionResults from '../../components/CollectionResults/CollectionResults';

import Layout from '../../components/Layout/Layout';
// import { useEffect } from "react";
// import SongList from "../../components/SongList/SongList";
// import { useCollection } from "../../hooks/useCollection";
// import styles from "./Uploaded.module.css";
// import ActionBar from "../../components/ActionBar/ActionBar";
export default function Uploaded({ scrollRef }) {
  const { user } = useAuthContext();
  const query = ['music', ['userID', '==', user.uid]];
  // const { documents: musicDocuments, error: musicError } = useCollection(
  //   "music",
  //   ["uid", "==", user.uid]
  // );

  return (
    <Layout user={user}>
      <CollectionResults
        scrollRef={scrollRef}
        query={query}
      />
    </Layout>
  );
}
