// Every activity has a cover image, but only visual activities (photography,
// graphic design) have gallery photos. Category is free text in admin, so match
// loosely: "Photography", "Street photography", "Graphic Design", "Poster design" … all count.
export function isVisualCategory(category: string): boolean {
  return /photograph|design/i.test(category);
}
