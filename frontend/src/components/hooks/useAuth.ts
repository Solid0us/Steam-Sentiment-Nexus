import useLocalStorage from "@/hooks/useLocalStorage";

export const useAuth = () =>
  useLocalStorage<string | null>("steamSentimentNexusJwt", null);
