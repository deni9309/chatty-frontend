import React from 'react'

interface GeometricPatternProps {
  width?: string | number
  height?: string | number
  className?: string
  gradientFrom?: string
  gradientTo?: string
  patternOpacity?: number
}

const GeometricPattern: React.FC<GeometricPatternProps> = ({
  width = '100%',
  height = '100%',
  className = '',
  //gradientFrom = 'from-base-300',
  //gradientTo = 'to-base-100',
  patternOpacity = 0.2,
}) => {
  const gradientId = `gradient-${Math.random().toString(36).substring(2, 9)}`
  const patternId = `pattern-${Math.random().toString(36).substring(2, 9)}`

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={className}>
      <defs>
        {/* Gradient using DaisyUI theme colors */}
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="0"
          y1="0"
          y2="100%"
          gradientTransform="rotate(273,768,347)"
        >
          <stop offset="0" className="[stop-color:var(--tw-color-base-100)]" />
          <stop offset="1" className="[stop-color:var(--tw-color-neutral)]" />
        </linearGradient>

        {/* Geometric pattern */}
        <pattern
          patternUnits="userSpaceOnUse"
          id={patternId}
          width="541"
          height="450.8"
          x="0"
          y="0"
          viewBox="0 0 1080 900"
        >
          <g fillOpacity={patternOpacity}>
            {/* Row 1 */}
            <polygon className="fill-primary" points="90 150 0 300 180 300" />
            <polygon className="fill-secondary" points="90 150 180 0 0 0" />
            <polygon className="fill-neutral" points="270 150 360 0 180 0" />
            <polygon className="fill-warning" points="450 150 360 300 540 300" />
            <polygon className="fill-accent" points="450 150 540 0 360 0" />
            <polygon className="fill-base-content" points="630 150 540 300 720 300" />
            <polygon className="fill-info" points="630 150 720 0 540 0" />
            <polygon className="fill-primary" points="810 150 720 300 900 300" />
            <polygon className="fill-secondary" points="810 150 900 0 720 0" />
            <polygon className="fill-accent" points="990 150 900 300 1080 300" />
            <polygon className="fill-neutral" points="990 150 1080 0 900 0" />

            {/* Row 2 */}
            <polygon className="fill-success" points="90 450 0 600 180 600" />
            <polygon className="fill-base-content" points="90 450 180 300 0 300" />
            <polygon className="fill-accent" points="270 450 180 600 360 600" />
            <polygon className="fill-primary" points="270 450 360 300 180 300" />
            <polygon className="fill-secondary" points="450 450 360 600 540 600" />
            <polygon className="fill-info" points="450 450 540 300 360 300" />
            <polygon className="fill-error" points="630 450 540 600 720 600" />
            <polygon className="fill-success" points="630 450 720 300 540 300" />
            <polygon className="fill-primary" points="810 450 720 600 900 600" />
            <polygon className="fill-secondary" points="810 450 900 300 720 300" />
            <polygon className="fill-warning" points="990 450 900 600 1080 600" />
            <polygon className="fill-neutral" points="990 450 1080 300 900 300" />

            {/* Row 3 */}
            <polygon className="fill-neutral" points="90 750 0 900 180 900" />
            <polygon className="fill-error" points="270 750 180 900 360 900" />
            <polygon className="fill-primary-content" points="270 750 360 600 180 600" />
            <polygon className="fill-warning" points="450 750 540 600 360 600" />
            <polygon className="fill-base-100" points="630 750 540 900 720 900" />
            <polygon className="fill-accent" points="630 750 720 600 540 600" />
            <polygon className="fill-success" points="810 750 720 900 900 900" />
            <polygon className="fill-primary-content" points="810 750 900 600 720 600" />
            <polygon className="fill-warning-content" points="990 750 900 900 1080 900" />

            {/* Additional triangular patterns */}
            <polygon className="fill-neutral-content" points="180 0 90 150 270 150" />
            <polygon className="fill-neutral" points="360 0 270 150 450 150" />
            <polygon className="fill-neutral" points="540 0 450 150 630 150" />
            <polygon className="fill-secondary-content" points="900 0 810 150 990 150" />

            <polygon className="fill-neutral" points="0 300 -90 450 90 450" />
            <polygon className="fill-secondary" points="0 300 90 150 -90 150" />
            <polygon className="fill-accent" points="180 300 90 450 270 450" />
            <polygon className="fill-neutral" points="180 300 270 150 90 150" />
            <polygon className="fill-accent-content" points="360 300 270 450 450 450" />
            <polygon className="fill-secondary" points="360 300 450 150 270 150" />
            <polygon className="fill-danger" points="540 300 450 450 630 450" />
            <polygon className="fill-info-content" points="540 300 630 150 450 150" />
            <polygon className="fill-secondary-content" points="720 300 630 450 810 450" />
            <polygon className="fill-secondary" points="720 300 810 150 630 150" />
            <polygon className="fill-info" points="900 300 810 450 990 450" />
            <polygon className="fill-info-content" points="900 300 990 150 810 150" />

            {/* Bottom section patterns */}
            <polygon className="fill-info" points="0 600 -90 750 90 750" />
            <polygon className="fill-neutral" points="0 600 90 450 -90 450" />
            <polygon className="fill-info" points="180 600 90 750 270 750" />
            <polygon className="fill-neutral" points="180 600 270 450 90 450" />
            <polygon className="fill-neutral" points="360 600 270 750 450 750" />
            <polygon className="fill-neutral" points="360 600 450 450 270 450" />
            <polygon className="fill-success" points="540 600 630 450 450 450" />
            <polygon className="fill-neutral" points="720 600 630 750 810 750" />
            <polygon className="fill-secondary" points="900 600 810 750 990 750" />
            <polygon className="fill-error" points="900 600 990 450 810 450" />

            {/* Final row */}
            <polygon className="fill-primary" points="0 900 90 750 -90 750" />
            <polygon className="fill-secondary" points="180 900 270 750 90 750" />
            <polygon className="fill-accent" points="360 900 450 750 270 750" />
            <polygon className="fill-info" points="540 900 630 750 450 750" />
            <polygon className="fill-primary" points="720 900 810 750 630 750" />
            <polygon className="fill-neutral" points="900 900 990 750 810 750" />

            {/* Edge patterns */}
            <polygon className="fill-neutral" points="1080 300 990 450 1170 450" />
            <polygon className="fill-secondary" points="1080 300 1170 150 990 150" />
            <polygon className="fill-info" points="1080 600 990 750 1170 750" />
            <polygon className="fill-neutral" points="1080 600 1170 450 990 450" />
            <polygon className="fill-primary" points="1080 900 1170 750 990 750" />
          </g>
        </pattern>
      </defs>

      {/* Background gradient */}
      <rect x="0" y="0" fill={`url(#${gradientId})`} width="100%" height="100%" />

      {/* Pattern overlay */}
      <rect x="0" y="0" fill={`url(#${patternId})`} width="100%" height="100%" />
    </svg>
  )
}

export default GeometricPattern
