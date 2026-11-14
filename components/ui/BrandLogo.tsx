import React from "react";

interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export default function BrandLogo({
  size = 32,
  width,
  height,
  className,
  ...props
}: BrandLogoProps) {
  const w = width ?? size;
  const h = height ?? size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="204 -36 1104 1104"
      width={w}
      height={h}
      fill="none"
      className={className}
      {...props}
    >
      <title>Vishva Patel — Metallic Ribbon V Emblem</title>
      <defs>
        <linearGradient
          id="vp-brand-ul-curl"
          x1="295"
          y1="228"
          x2="368"
          y2="446"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#223337" />
          <stop offset="45%" stopColor="#2D4C52" />
          <stop offset="85%" stopColor="#356870" />
          <stop offset="100%" stopColor="#31737C" />
        </linearGradient>
        <linearGradient
          id="vp-brand-ur-arch"
          x1="725"
          y1="435"
          x2="1245"
          y2="385"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#3B4B51" />
          <stop offset="22%" stopColor="#6B797E" />
          <stop offset="48%" stopColor="#9A9A9A" />
          <stop offset="72%" stopColor="#B9ABA3" />
          <stop offset="90%" stopColor="#D6CECA" />
          <stop offset="100%" stopColor="#E6E1DE" />
        </linearGradient>
        <linearGradient
          id="vp-brand-ur-rim"
          x1="750"
          y1="395"
          x2="1240"
          y2="380"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#8FA0A6" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient
          id="vp-brand-right-pocket"
          x1="1205"
          y1="365"
          x2="1250"
          y2="445"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0A3E46" />
          <stop offset="60%" stopColor="#0E5A64" />
          <stop offset="100%" stopColor="#08424B" />
        </linearGradient>
        <linearGradient
          id="vp-brand-lr-cyan"
          x1="1245"
          y1="420"
          x2="845"
          y2="690"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0B6774" />
          <stop offset="18%" stopColor="#01B4C9" />
          <stop offset="38%" stopColor="#00C6DA" />
          <stop offset="62%" stopColor="#029BB0" />
          <stop offset="85%" stopColor="#046C7A" />
          <stop offset="100%" stopColor="#0F4046" />
        </linearGradient>
        <linearGradient
          id="vp-brand-left-pocket"
          x1="330"
          y1="715"
          x2="385"
          y2="625"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#016873" />
          <stop offset="55%" stopColor="#037C86" />
          <stop offset="100%" stopColor="#06535B" />
        </linearGradient>
        <linearGradient
          id="vp-brand-cyan-bevel"
          x1="380"
          y1="635"
          x2="600"
          y2="480"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#047480" />
          <stop offset="50%" stopColor="#028E9D" />
          <stop offset="100%" stopColor="#035E68" />
        </linearGradient>
        <linearGradient
          id="vp-brand-ul-cyan-loop"
          x1="715"
          y1="715"
          x2="565"
          y2="430"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#08484F" />
          <stop offset="18%" stopColor="#018E9E" />
          <stop offset="38%" stopColor="#00E1F0" />
          <stop offset="55%" stopColor="#58F1FE" />
          <stop offset="76%" stopColor="#14DCEB" />
          <stop offset="92%" stopColor="#05A9B8" />
          <stop offset="100%" stopColor="#047B88" />
        </linearGradient>
        <linearGradient
          id="vp-brand-main-v"
          x1="410"
          y1="210"
          x2="785"
          y2="745"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="16%" stopColor="#FDFDFE" />
          <stop offset="32%" stopColor="#E2E1E3" />
          <stop offset="48%" stopColor="#B0B4B8" />
          <stop offset="65%" stopColor="#767A81" />
          <stop offset="82%" stopColor="#48494D" />
          <stop offset="94%" stopColor="#352D29" />
          <stop offset="100%" stopColor="#2A221E" />
        </linearGradient>
        <linearGradient
          id="vp-brand-main-v-rim"
          x1="360"
          y1="220"
          x2="755"
          y2="775"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#F0F2F4" stopOpacity="0.8" />
          <stop offset="80%" stopColor="#9BA0A6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4A4542" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient
          id="vp-brand-gold-left"
          x1="1234"
          y1="93"
          x2="668"
          y2="941"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFF394" />
          <stop offset="18%" stopColor="#FEE458" />
          <stop offset="42%" stopColor="#FDD043" />
          <stop offset="68%" stopColor="#FCA925" />
          <stop offset="88%" stopColor="#F68B16" />
          <stop offset="100%" stopColor="#E56A0A" />
        </linearGradient>
        <linearGradient
          id="vp-brand-gold-right"
          x1="1234"
          y1="93"
          x2="668"
          y2="941"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F9B22B" />
          <stop offset="22%" stopColor="#F28E13" />
          <stop offset="50%" stopColor="#E26D06" />
          <stop offset="78%" stopColor="#C94E02" />
          <stop offset="93%" stopColor="#A83801" />
          <stop offset="100%" stopColor="#8C2B00" />
        </linearGradient>
      </defs>

      <path
        d="M 263 272 C 261 244, 286 220, 332 218 C 365 217, 392 225, 404 238 C 366 254, 344 286, 342 326 C 340 364, 353 404, 372 446 C 332 396, 294 344, 272 302 C 265 289, 263 280, 263 272 Z"
        fill="url(#vp-brand-ul-curl)"
      />
      <path
        d="M 1204 352 C 1228 368, 1246 392, 1251 418 C 1247 434, 1236 452, 1218 470 C 1222 442, 1216 408, 1196 382 Z"
        fill="url(#vp-brand-right-pocket)"
      />
      <path
        d="M 1222 396 C 1240 404, 1249 411, 1251 418 C 1246 436, 1226 468, 1188 504 C 1132 558, 1036 616, 932 664 C 896 680, 862 694, 832 705 L 826 684 C 864 670, 906 652, 950 632 C 1044 588, 1136 530, 1188 470 C 1208 446, 1220 420, 1222 396 Z"
        fill="url(#vp-brand-lr-cyan)"
      />
      <path
        d="M 702 422 C 768 384, 852 342, 936 312 C 1012 285, 1082 282, 1138 299 C 1194 316, 1238 358, 1251 418 C 1222 404, 1176 392, 1116 387 C 1042 381, 952 394, 864 416 C 808 430, 758 446, 722 460 Z"
        fill="url(#vp-brand-ur-arch)"
      />
      <path
        d="M 704 421 C 770 383, 854 341, 938 311 C 1014 284, 1084 281, 1140 298 C 1195 315, 1238 357, 1251 418 C 1236 361, 1192 320, 1137 303 C 1081 286, 1012 289, 936 315 C 853 345, 770 386, 705 424 Z"
        fill="url(#vp-brand-ur-rim)"
      />
      <path
        d="M 327 694 C 325 668, 342 636, 376 608 L 398 632 C 374 662, 362 692, 366 718 C 344 714, 329 706, 327 694 Z"
        fill="url(#vp-brand-left-pocket)"
      />
      <path
        d="M 374 624 C 418 566, 488 500, 588 424 L 608 492 C 516 544, 442 598, 386 648 Z"
        fill="url(#vp-brand-cyan-bevel)"
      />
      <path
        d="M 728 703 L 734 714 C 652 732, 554 748, 468 752 C 386 756, 331 734, 327 694 C 324 660, 358 606, 418 542 C 464 493, 516 448, 566 410 L 598 474 C 536 512, 474 560, 422 612 C 376 658, 354 694, 368 712 C 384 732, 444 736, 524 730 C 596 725, 668 714, 728 703 Z"
        fill="url(#vp-brand-ul-cyan-loop)"
      />
      <path
        d="M 263 272 C 262 230, 304 194, 384 193 C 468 192, 556 226, 622 296 C 686 364, 744 466, 844 642 L 756 782 C 672 628, 600 496, 534 388 C 478 296, 430 242, 378 226 C 324 210, 274 234, 263 272 Z"
        fill="url(#vp-brand-main-v)"
      />
      <path
        d="M 378 226 C 430 242, 478 296, 534 388 C 600 496, 672 628, 756 782 L 760 776 C 676 623, 604 492, 538 385 C 481 292, 433 239, 380 223 Z"
        fill="url(#vp-brand-main-v-rim)"
      />
      <path
        d="M 1234 93 C 1138 204, 1022 348, 926 484 C 832 618, 748 790, 668 941 C 756 806, 868 644, 968 496 C 1066 350, 1158 212, 1234 93 Z"
        fill="url(#vp-brand-gold-left)"
      />
      <path
        d="M 1234 93 C 1158 212, 1066 350, 968 496 C 868 644, 756 806, 668 941 C 768 812, 898 656, 998 504 C 1094 358, 1172 218, 1234 93 Z"
        fill="url(#vp-brand-gold-right)"
      />
    </svg>
  );
}

