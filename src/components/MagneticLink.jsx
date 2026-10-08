import useMagnetic from '../hooks/useMagnetic';
import useRipple from '../hooks/useRipple';

/**
 * Anchor with a subtle magnetic pull (see useMagnetic for behaviour).
 * Set `ripple` to add a restrained click ripple (see useRipple).
 * All other props pass through to the underlying <a>.
 */
export default function MagneticLink({
  strength,
  ripple = false,
  rippleColor,
  onClick,
  className = '',
  children,
  ...props
}) {
  const { ref, onMouseMove, onMouseLeave } = useMagnetic(strength ?? 0.14);
  const ripples = useRipple({ color: rippleColor });

  const handleClick = ripple
    ? (e) => {
        ripples.perform(e);
        if (onClick) onClick(e);
      }
    : onClick;

  return (
    <a
      className={`${ripple ? 'has-ripple ' : ''}${className}`}
      {...props}
      onClick={handleClick}
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
}