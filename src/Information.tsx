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
      <br />
      <br />
      Open the console to see the keys warnings and look at the console log
      <br />
      <span style={{ fontWeight: 'bold' }}>below</span> the keys warning to see
      liveblocks duplicating the array elements
    </p>
  );
}
