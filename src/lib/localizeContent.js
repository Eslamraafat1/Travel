export function localizePackage(pkg, lang) {
  if (!pkg || lang === "ar") return pkg;
  return {
    ...pkg,
    title: pkg.titleEn || pkg.title,
    description: pkg.descriptionEn || pkg.description,
    destination: pkg.destinationEn || pkg.destination,
    duration: pkg.durationEn || pkg.duration,
    badge: pkg.badgeEn ?? pkg.badge,
    includes: pkg.includesEn || pkg.includes,
    itinerary: pkg.itineraryEn || pkg.itinerary,
  };
}

export function localizeTrip(trip, lang) {
  if (!trip || lang === "ar") return trip;
  return {
    ...trip,
    title: trip.titleEn || trip.title,
    description: trip.descriptionEn || trip.description,
    destination: trip.destinationEn || trip.destination,
    duration: trip.durationEn || trip.duration,
    difficulty: trip.difficultyEn || trip.difficulty,
    type: trip.typeEn || trip.type,
    highlights: trip.highlightsEn || trip.highlights,
    meetingPoint: trip.meetingPointEn || trip.meetingPoint,
    requirements: trip.requirementsEn || trip.requirements,
    included: trip.includedEn || trip.included,
    excluded: trip.excludedEn || trip.excluded,
    faqs: trip.faqsEn || trip.faqs,
  };
}
