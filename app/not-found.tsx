import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main id="main" className={styles.container}>
      <Link
        href="/"
        className={styles.faceLink}
        aria-label="Return to home page"
        title="Return to home"
      >
        <svg
          className={styles.face}
          viewBox="0 0 320 380"
          width="320"
          height="380"
          role="img"
          aria-label="A 404 transforms into a face that looks around and blinks."
        >
          <defs>
            <linearGradient
              id="notFoundCyanGold"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="320"
              y2="380"
            >
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="40%" stopColor="#57d4e5" />
              <stop offset="75%" stopColor="#f6d36f" />
              <stop offset="100%" stopColor="#d9a33d" />
            </linearGradient>
          </defs>
          <g
            fill="none"
            stroke="url(#notFoundCyanGold)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="25"
          >
            <g className={styles.faceEyes} transform="translate(0, 112.5)">
              <g transform="translate(15, 0)">
                <polyline className={styles.faceEyeLid} points="37,0 0,120 75,120" />
                <polyline
                  className={styles.facePupil}
                  points="55,120 55,155"
                  strokeDasharray="35 35"
                />
              </g>
              <g transform="translate(230, 0)">
                <polyline className={styles.faceEyeLid} points="37,0 0,120 75,120" />
                <polyline
                  className={styles.facePupil}
                  points="55,120 55,155"
                  strokeDasharray="35 35"
                />
              </g>
            </g>
            <rect
              className={styles.faceNose}
              rx="4"
              ry="4"
              x="132.5"
              y="112.5"
              width="55"
              height="155"
            />
            <g strokeDasharray="102 102" transform="translate(65, 334)">
              <path
                className={styles.faceMouthLeft}
                d="M 0 30 C 0 30 40 0 95 0"
                strokeDashoffset="-102"
              />
              <path
                className={styles.faceMouthRight}
                d="M 95 0 C 150 0 190 30 190 30"
                strokeDashoffset="102"
              />
            </g>
          </g>
        </svg>
      </Link>
    </main>
  );
}
