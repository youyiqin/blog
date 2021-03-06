import Link from "next/link";
// eslint-disable-next-line import/no-unresolved
import styles from "../styles/tag.module.sass";

export default function Tag({
  tagName,
  clickEvent,
}: {
  tagName: string;
  clickEvent: any;
}) {
  return (
    <button
      className={styles.btn}
      type="button"
      onClick={() => clickEvent(tagName)}
    >
      <Link href="/tag">
        <a>{tagName}</a>
      </Link>
    </button>
  );
}
