// 필터 검색 옵션 (Figma 548-8769)
export const JOB_OPTIONS = [
  "Front-End",
  "Back-End",
  "Server",
  "UX/UI Design",
  "FullStack",
  "Graphic Design",
  "Umbrella",
  "Taco-Bell",
  "Back-Tumbling",
  "AI",
  "Well Done",
  "Medium Rare",
  "Rare",
  "Overcooked",
  "Brilliant",
  "Genius",
  "Unbelievable",
  "Awesome",
];

export const TECH_OPTIONS = [
  "React",
  "Next.js",
  "Figma",
  "OMG",
  "Node.js",
  "Spring",
  "Illustrator",
  "Photoshop",
  "Umbrella",
  "Taco-Bell",
  "Back-Tumbling",
  "Well Done",
  "Medium Rare",
  "Rare",
  "Overcooked",
  "Brilliant",
  "Genius",
  "Unbelievable",
  "Awesome",
];

export interface SearchFilters {
  keyword: string;
  jobs: string[];
  techs: string[];
}

export const EMPTY_FILTERS: SearchFilters = { keyword: "", jobs: [], techs: [] };

/** 선택된 필터를 "Jin_Venus08, UX/UI Design, Illustrator, ..." 형태 문자열로 */
export function summarizeFilters(f: SearchFilters): string {
  return [f.keyword.trim(), ...f.jobs, ...f.techs].filter(Boolean).join(", ");
}
