import styles from "./section-cards.module.css";
import Card from "./card";
import Link from "next/link"
import cls from "classnames";

const SectionCards = ({title, videos=[], size, shouldWrap = false, shouldScale}) => {
    return (
        <section className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <div className={cls(styles.cardWrapper, shouldWrap && styles.wrap)}>
            {videos.map((video, idx) => {
                return (
                <Link key={idx} href={`/video/${video.id}`}>
                <a>
                <Card 
                key={idx}
                id={idx}
                imgUrl= {video.imgUrl}
                size={size}
                shouldScale={shouldScale}
                />
                </a>
                </Link>
                )})} 
            </div>      
        </section>
    )
}

export default SectionCards