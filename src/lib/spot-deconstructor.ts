export type Item = {
  readonly location: string;
  readonly row: string;
  readonly spot: string;
  readonly date: Date;
};

// [location (2ch)][row (2ch)][spot (rest of numbers)]

export function spotDeconstructor(originalString: string, url = true): Item {
  const spot =
    url && originalString
      ? (originalString.split("/").pop() as string)
      : originalString;

  console.log(spot);
  const location = spot.slice(0, 2);
  const row = spot.slice(2, 4);
  const spotNum = spot.slice(4);
  return { location, row, spot: spotNum, date: new Date() };
}

export function spotConstructor({ row, location, spot, date }: Item): string {
  return `${location}${row}${spot}@${new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(date)}`;
}
