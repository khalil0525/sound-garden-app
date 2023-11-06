import styles from './Home.module.css';

import { useAuthContext } from '../../hooks/useAuthContext';
import Card from '../../components/UI/Card/Card';
import CardList from '../../components/CardList/CardList';
import Button from '../../components/UI/Button/Button';
import card1bg from '../../images/cardBg1.png';
import card2bg from '../../images/cardBg2.png';
import card3bg from '../../images/cardBg3.png';
import womanListeningToMusicBg from '../../images/woman-listening-to-music.png';
import TwoColumnLayout from '../../components/Layout/TwoColumnLayout';
import CollectionResults from '../../components/CollectionResults/CollectionResults';
const tempList = [
  { title: 'Top 50 tamil', content: '50 tracks', background: card1bg },
  { title: 'Weekly Hits', content: '100 tracks', background: card2bg },
  { title: 'Tolly Hit track', content: '60 Tracks', background: card3bg },
];
export default function Home({ scrollRef }) {
  const query = ['music', ['userID', '==', 'xCvggxf5HPhL9xBbHOz49BWcsly2']];
  const { user } = useAuthContext();
  return (
    <TwoColumnLayout user={user}>
      <div className={styles['home__leftSide']}>
        <Card
          background={null}
          className={styles['home__banner']}>
          <div className={styles['home__banner_container']}>
            <p>SoundGarden</p>
            <h1 className={styles['home__title']}>
              Listen to latest trending Music all the time
            </h1>
            <p>With SoundGarden, you can get premium quality music for free</p>
            <Button
              className={styles['home__banner_button']}
              buttonSize="large"
              altText="Listed now Icon">
              Listen Now
            </Button>
          </div>
          <div className={styles['home__banner_img']}>
            <img
              src={womanListeningToMusicBg}
              alt="woman listening to music"></img>
          </div>
        </Card>
        <div className={styles['home__container']}>
          <p className={styles['home__title']}>Playlists</p>
          <CardList
            className={styles['home__cardList']}
            list={tempList}
            page=""
          />
          <div className={styles['home__container']}>
            <p className={styles['home__title']}>Trending</p>
            {query && (
              <CollectionResults
                scrollRef={scrollRef}
                query={query}
              />
            )}
          </div>
        </div>
      </div>

      {/* <div className={styles['home__rightSide']}>
        <Card className={styles['home__cardRight']}>
          <h1 className={styles['home__title']}>Subscribe To Premium Now</h1>
        </Card>
        <div className={styles['home__container']}>
          <p className={styles['home__title']}>Top Artists</p>;
        </div>
      </div> */}
    </TwoColumnLayout>
  );
}
