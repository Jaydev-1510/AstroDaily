import { createClient } from "@supabase/supabase-js";
import { type Database } from "./types/database.d";
import { config } from "./types/env.d";

const KEY = config.SUPABASE_KEY;
const URL = config.SUPABASE_URL;

export const database = createClient<Database>(URL, KEY);
