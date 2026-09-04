/**
 * Georgia's twelve administrative regions — names only.
 *
 * The projected boundary geometry lives in georgia-regions.json and is imported
 * *only* by the WebGL scene. Keeping the two apart matters: the list beside the
 * map needs the names, and pulling the 37 kB of coordinates in with them put the
 * whole geometry into the main bundle for the sake of twelve labels.
 *
 * Source: geoBoundaries ADM1 (gbOpen licence).
 */
export type RegionStatus = 'operating' | 'development' | 'planned' | 'none';

export interface RegionName {
  id: string;
  en: string;
  ka: string;
}

export const GEORGIA_REGIONS: RegionName[] = [
  { id: 'abkhazia', en: 'Abkhazia', ka: 'აფხაზეთი' },
  { id: 'adjara', en: 'Adjara', ka: 'აჭარა' },
  { id: 'guria', en: 'Guria', ka: 'გურია' },
  { id: 'imereti', en: 'Imereti', ka: 'იმერეთი' },
  { id: 'kakheti', en: 'Kakheti', ka: 'კახეთი' },
  { id: 'kvemo-kartli', en: 'Kvemo Kartli', ka: 'ქვემო ქართლი' },
  { id: 'mtskheta-mtianeti', en: 'Mtskheta-Mtianeti', ka: 'მცხეთა-მთიანეთი' },
  { id: 'racha-lechkhumi', en: 'Racha-Lechkhumi and Kvemo Svaneti', ka: 'რაჭა-ლეჩხუმი და ქვემო სვანეთი' },
  { id: 'samegrelo', en: 'Samegrelo-Zemo Svaneti', ka: 'სამეგრელო-ზემო სვანეთი' },
  { id: 'samtskhe-javakheti', en: 'Samtskhe-Javakheti', ka: 'სამცხე-ჯავახეთი' },
  { id: 'shida-kartli', en: 'Shida Kartli', ka: 'შიდა ქართლი' },
  { id: 'tbilisi', en: 'Tbilisi', ka: 'თბილისი' },
];
