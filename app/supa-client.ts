import { createClient } from "@supabase/supabase-js";
import {
  type MergeDeep,
  type SetFieldType,
  type SetNonNullable,
} from "type-fest";
import { type Database as SupabaseDatabase } from "database.types";

type Database = MergeDeep<
  SupabaseDatabase,
  {
    public: {
      Views: {
        community_post_list_view: {
          Row: SetFieldType<
            SetNonNullable<
              SupabaseDatabase["public"]["Views"]["community_post_list_view"]["Row"]
            >,
            "author_avatar",
            string | null
          >;
        };
      };
    };
  }
>;

const client = createClient<Database>(
  "https://jalgcpyftjwometfpoim.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbGdjcHlmdGp3b21ldGZwb2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Nzg5MTcsImV4cCI6MjA4NDI1NDkxN30.6wG5oRYGHrBGH4ukVP5_RMXT1JL-UNLY1KtbsWAnG_E",
);

export default client;
