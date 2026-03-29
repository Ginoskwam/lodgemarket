/**
 * Marque Lodgemarket — pictogramme d’échange (hérité du design initial).
 */
export function LodgemarketLogo({
  size = 40,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="48" fill="#C2410C" className="transition-all duration-300" />
      <g transform="translate(50, 50)">
        <circle cx="-15" cy="-20" r="8" fill="#FFFBEB" />
        <path
          d="M -15 -12 Q -15 5 -15 15 Q -15 25 -10 25 Q -5 25 -5 20 L -5 15 Q -5 5 -5 -12 Z"
          fill="#FFFBEB"
        />
        <ellipse cx="-8" cy="5" rx="4" ry="12" fill="#FFFBEB" transform="rotate(-20 -8 5)" />
        <ellipse cx="-22" cy="5" rx="4" ry="12" fill="#FFFBEB" transform="rotate(20 -22 5)" />
      </g>
      <g transform="translate(50, 50)">
        <circle cx="15" cy="-20" r="8" fill="#FEF3C7" />
        <path
          d="M 15 -12 Q 15 5 15 15 Q 15 25 10 25 Q 5 25 5 20 L 5 15 Q 5 5 5 -12 Z"
          fill="#FEF3C7"
        />
        <ellipse cx="22" cy="5" rx="4" ry="12" fill="#FEF3C7" transform="rotate(-20 22 5)" />
        <ellipse cx="8" cy="5" rx="4" ry="12" fill="#FEF3C7" transform="rotate(20 8 5)" />
      </g>
      <path
        d="M 35 50 Q 50 45 65 50"
        stroke="#FFFBEB"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  )
}

export function LodgemarketLogoSimple({
  size = 32,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="48" fill="#C2410C" />
      <g transform="translate(50, 50)">
        <circle cx="-12" cy="-15" r="6" fill="#FFFBEB" />
        <ellipse cx="-12" cy="0" rx="6" ry="12" fill="#FFFBEB" />
      </g>
      <g transform="translate(50, 50)">
        <circle cx="12" cy="-15" r="6" fill="#FEF3C7" />
        <ellipse cx="12" cy="0" rx="6" ry="12" fill="#FEF3C7" />
      </g>
      <path
        d="M 38 50 Q 50 48 62 50"
        stroke="#FFFBEB"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  )
}
