--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg120+1)
-- Dumped by pg_dump version 17.5

-- Started on 2025-11-14 23:31:38 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 24577)
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    avatar_url text DEFAULT ''::text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    is_email_verified boolean DEFAULT false NOT NULL,
    captcha_ticker integer DEFAULT 0 NOT NULL,
    premium smallint DEFAULT 0 NOT NULL,
    last_password_reset bigint DEFAULT 0 NOT NULL,
    password_reset_code text DEFAULT ''::text NOT NULL,
    created_at bigint NOT NULL
);


ALTER TABLE public.account OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24686)
-- Name: answer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.answer (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bet_id uuid NOT NULL,
    in_pot numeric(27,9) DEFAULT 0 NOT NULL,
    base_odds numeric(27,9) DEFAULT 2 NOT NULL,
    current_odds numeric(27,9) DEFAULT 2 NOT NULL,
    member_count integer DEFAULT 0 NOT NULL,
    estimate__from numeric(27,9) DEFAULT 0 NOT NULL,
    choice__title text DEFAULT ''::text NOT NULL,
    created_at bigint NOT NULL
);


ALTER TABLE public.answer OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24653)
-- Name: bet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bet (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    game_id uuid NOT NULL,
    title text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    bet_type text NOT NULL,
    member_count integer DEFAULT 0 NOT NULL,
    in_pot numeric(27,9) DEFAULT 0 NOT NULL,
    estimate__correct_answer numeric(27,9) DEFAULT 0 NOT NULL,
    dynamic_odds boolean DEFAULT false NOT NULL,
    dynamic_odds_power numeric(27,9) DEFAULT 1 NOT NULL,
    is_canceled boolean DEFAULT false NOT NULL,
    is_solved boolean DEFAULT false NOT NULL,
    is_paid boolean DEFAULT false NOT NULL,
    timelimit bigint DEFAULT 0 NOT NULL,
    estimate__step numeric(27,9) DEFAULT 1 NOT NULL,
    estimate__min numeric(27,9) DEFAULT 0 NOT NULL,
    estimate__max numeric(27,9) DEFAULT 100 NOT NULL,
    estimate__winrate numeric(27,9) DEFAULT 50 NOT NULL,
    created_at bigint NOT NULL,
    solved_at bigint DEFAULT 0 NOT NULL
);


ALTER TABLE public.bet OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24580)
-- Name: game; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    account_id uuid NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    banner_url text DEFAULT ''::text NOT NULL,
    currency_name text DEFAULT '⭐'::text NOT NULL,
    language character(2) DEFAULT 'en'::bpchar NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    bet_count smallint DEFAULT 0 NOT NULL,
    member_count integer DEFAULT 0 NOT NULL,
    start_currency numeric(27,9) DEFAULT 1000 NOT NULL,
    created_at bigint NOT NULL
);


ALTER TABLE public.game OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 32868)
-- Name: game_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    game_id uuid NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    created_at bigint NOT NULL
);


ALTER TABLE public.game_log OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 32877)
-- Name: game_message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_message (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    game_id uuid NOT NULL,
    account_id uuid NOT NULL,
    message text NOT NULL,
    created_at bigint NOT NULL
);


ALTER TABLE public.game_message OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 32856)
-- Name: member; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.member (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    game_id uuid NOT NULL,
    account_id uuid NOT NULL,
    is_moderator boolean DEFAULT false NOT NULL,
    is_banned boolean DEFAULT false NOT NULL,
    is_favorited boolean DEFAULT true NOT NULL,
    currency numeric(27,9) NOT NULL,
    created_at bigint NOT NULL
);


ALTER TABLE public.member OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24711)
-- Name: tip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tip (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    answer_id uuid NOT NULL,
    account_id uuid NOT NULL,
    odds numeric(27,9) NOT NULL,
    currency numeric(27,9) NOT NULL,
    diff numeric(27,9) DEFAULT 0 NOT NULL,
    created_at bigint NOT NULL
);


ALTER TABLE public.tip OWNER TO postgres;

--
-- TOC entry 3287 (class 2606 OID 32901)
-- Name: account account_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_email_key UNIQUE (email);


--
-- TOC entry 3289 (class 2606 OID 32897)
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (id);


--
-- TOC entry 3291 (class 2606 OID 32899)
-- Name: account account_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_username_key UNIQUE (username);


--
-- TOC entry 3301 (class 2606 OID 24700)
-- Name: answer answer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (id);


--
-- TOC entry 3298 (class 2606 OID 24667)
-- Name: bet bet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bet
    ADD CONSTRAINT bet_pkey PRIMARY KEY (id);


--
-- TOC entry 3315 (class 2606 OID 32895)
-- Name: game_log game_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_log
    ADD CONSTRAINT game_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3319 (class 2606 OID 32893)
-- Name: game_message game_message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_message
    ADD CONSTRAINT game_message_pkey PRIMARY KEY (id);


--
-- TOC entry 3294 (class 2606 OID 24633)
-- Name: game game_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_pkey PRIMARY KEY (id);


--
-- TOC entry 3296 (class 2606 OID 32967)
-- Name: game game_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_slug_key UNIQUE (slug);


--
-- TOC entry 3310 (class 2606 OID 32963)
-- Name: member member_game_id_account_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_game_id_account_id_key UNIQUE (game_id, account_id);


--
-- TOC entry 3312 (class 2606 OID 32864)
-- Name: member member_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id);


--
-- TOC entry 3306 (class 2606 OID 32854)
-- Name: tip tip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tip
    ADD CONSTRAINT tip_pkey PRIMARY KEY (id);


--
-- TOC entry 3302 (class 1259 OID 32907)
-- Name: fki_fk_answer_bet; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_answer_bet ON public.answer USING btree (bet_id);


--
-- TOC entry 3299 (class 1259 OID 32913)
-- Name: fki_fk_bet_game; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_bet_game ON public.bet USING btree (game_id);


--
-- TOC entry 3292 (class 1259 OID 32919)
-- Name: fki_fk_game_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_game_account ON public.game USING btree (account_id);


--
-- TOC entry 3313 (class 1259 OID 32937)
-- Name: fki_fk_game_log_game; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_game_log_game ON public.game_log USING btree (game_id);


--
-- TOC entry 3316 (class 1259 OID 32931)
-- Name: fki_fk_game_message_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_game_message_account ON public.game_message USING btree (account_id);


--
-- TOC entry 3317 (class 1259 OID 32925)
-- Name: fki_fk_game_message_game; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_game_message_game ON public.game_message USING btree (game_id);


--
-- TOC entry 3307 (class 1259 OID 32949)
-- Name: fki_fk_member_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_member_account ON public.member USING btree (account_id);


--
-- TOC entry 3308 (class 1259 OID 32943)
-- Name: fki_fk_member_game; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_member_game ON public.member USING btree (game_id);


--
-- TOC entry 3303 (class 1259 OID 32961)
-- Name: fki_fk_tip_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_tip_account ON public.tip USING btree (account_id);


--
-- TOC entry 3304 (class 1259 OID 32955)
-- Name: fki_fk_tip_answer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_tip_answer ON public.tip USING btree (answer_id);


--
-- TOC entry 3322 (class 2606 OID 32902)
-- Name: answer fk_answer_bet; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT fk_answer_bet FOREIGN KEY (bet_id) REFERENCES public.bet(id);


--
-- TOC entry 3321 (class 2606 OID 32908)
-- Name: bet fk_bet_game; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bet
    ADD CONSTRAINT fk_bet_game FOREIGN KEY (game_id) REFERENCES public.game(id);


--
-- TOC entry 3320 (class 2606 OID 32914)
-- Name: game fk_game_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT fk_game_account FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- TOC entry 3327 (class 2606 OID 32932)
-- Name: game_log fk_game_log_game; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_log
    ADD CONSTRAINT fk_game_log_game FOREIGN KEY (game_id) REFERENCES public.game(id);


--
-- TOC entry 3328 (class 2606 OID 32926)
-- Name: game_message fk_game_message_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_message
    ADD CONSTRAINT fk_game_message_account FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- TOC entry 3329 (class 2606 OID 32920)
-- Name: game_message fk_game_message_game; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_message
    ADD CONSTRAINT fk_game_message_game FOREIGN KEY (game_id) REFERENCES public.game(id);


--
-- TOC entry 3325 (class 2606 OID 32944)
-- Name: member fk_member_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT fk_member_account FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- TOC entry 3326 (class 2606 OID 32938)
-- Name: member fk_member_game; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT fk_member_game FOREIGN KEY (game_id) REFERENCES public.game(id);


--
-- TOC entry 3323 (class 2606 OID 32956)
-- Name: tip fk_tip_account; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tip
    ADD CONSTRAINT fk_tip_account FOREIGN KEY (account_id) REFERENCES public.account(id);


--
-- TOC entry 3324 (class 2606 OID 32950)
-- Name: tip fk_tip_answer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tip
    ADD CONSTRAINT fk_tip_answer FOREIGN KEY (answer_id) REFERENCES public.answer(id);


-- Completed on 2025-11-14 23:31:38 UTC

--
-- PostgreSQL database dump complete
--

