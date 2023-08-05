type Informaton = {
  intervalSpeed: number;
};

/**
 * Infromation about interval speed
 */
export function Informaton({ intervalSpeed }: Informaton) {
  return (
    <p style={{ position: 'fixed', right: 10, top: 0, color: 'black' }}>
      Moving layer every {intervalSpeed}ms
    </p>
  );
}
