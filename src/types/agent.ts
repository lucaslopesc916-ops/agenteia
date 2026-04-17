export interface BusinessHours {
  enabled: boolean;
  days: Record<string, { active: boolean; start: string; end: string }>;
}

export interface BehaviorSettings {
  transferToHuman: boolean;
  summaryOnTransfer: boolean;
  useEmojis: boolean;
  signAgentName: boolean;
  restrictTopics: boolean;
  splitResponses: boolean;
  allowReminders: boolean;
  timezone: string;
  responseDelay: number;
  interactionLimit: number;
  businessHours: BusinessHours;
}

export interface CalendarEntry {
  id: string;
  name: string;
  calendarId: string;
  minAdvanceHours: number;
  maxDistanceDays: number;
  simultaneousBookings: number;
  alwaysOpen: boolean;
  weeklyHours: Record<string, { active: boolean; start: string; end: string }>;
}

export interface CalendarConfig {
  googleMeet: boolean;
  checkAvailability: boolean;
  restrictFullHours: boolean;
  distributionMode: "sequential" | "intelligent";
}

export interface CalendarFields {
  name: boolean;
  company: boolean;
  duration: string;
  summary: boolean;
  email: boolean;
  subject: boolean;
  subjectTemplate: string;
}

export interface CalendarBehavior {
  config: CalendarConfig;
  fields: CalendarFields;
  calendars: CalendarEntry[];
}

export interface AgentBehavior {
  settings: BehaviorSettings;
  calendar: CalendarBehavior;
}

const defaultWeeklyHours: Record<string, { active: boolean; start: string; end: string }> = {
  seg: { active: true, start: "10:00", end: "18:00" },
  ter: { active: true, start: "10:00", end: "18:00" },
  qua: { active: true, start: "10:00", end: "18:00" },
  qui: { active: true, start: "10:00", end: "18:00" },
  sex: { active: true, start: "10:00", end: "18:00" },
  sab: { active: false, start: "09:00", end: "13:00" },
  dom: { active: false, start: "09:00", end: "13:00" },
};

export const defaultBehavior: AgentBehavior = {
  settings: {
    transferToHuman: true,
    summaryOnTransfer: false,
    useEmojis: false,
    signAgentName: true,
    restrictTopics: true,
    splitResponses: true,
    allowReminders: true,
    timezone: "America/Sao_Paulo",
    responseDelay: 10,
    interactionLimit: 0,
    businessHours: {
      enabled: false,
      days: { ...defaultWeeklyHours },
    },
  },
  calendar: {
    config: {
      googleMeet: true,
      checkAvailability: true,
      restrictFullHours: false,
      distributionMode: "intelligent",
    },
    fields: {
      name: false,
      company: false,
      duration: "1h 30m",
      summary: false,
      email: true,
      subject: false,
      subjectTemplate: "Winner.IA & {whatsappName} &{whatsappPhone}",
    },
    calendars: [],
  },
};

export function mergeBehavior(existing: Partial<AgentBehavior> | null): AgentBehavior {
  if (!existing) return { ...defaultBehavior };
  return {
    settings: { ...defaultBehavior.settings, ...existing.settings },
    calendar: {
      config: { ...defaultBehavior.calendar.config, ...existing.calendar?.config },
      fields: { ...defaultBehavior.calendar.fields, ...existing.calendar?.fields },
      calendars: existing.calendar?.calendars || [],
    },
  };
}
