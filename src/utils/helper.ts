/**
 * Extracts the first name from a full name.
 *
 * @param fullName The full name from which to extract the first name.
 * @returns The first name extracted from the full name.
 */
export function getFirstName(fullName: string): string {
  const firstName = fullName.split(" ")[0];
  return firstName;
}
