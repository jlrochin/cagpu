--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: directions; Type: TABLE; Schema: public; Owner: cagpu_user
--

CREATE TABLE public.directions (
    id character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    services_count integer DEFAULT 0
);


ALTER TABLE public.directions OWNER TO cagpu_user;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: cagpu_user
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    message text,
    user_id integer,
    service_id character varying(50),
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO cagpu_user;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: cagpu_user
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO cagpu_user;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cagpu_user
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: cagpu_user
--

CREATE TABLE public.services (
    id character varying(50) NOT NULL,
    direction_id character varying(50),
    name character varying(100) NOT NULL,
    responsible_person character varying(100),
    phone_extension character varying(10),
    service_type character varying(50),
    location character varying(200),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.services OWNER TO cagpu_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: cagpu_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    department character varying(100),
    phone character varying(20),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO cagpu_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: cagpu_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO cagpu_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cagpu_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: cagpu_user
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: cagpu_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: directions; Type: TABLE DATA; Schema: public; Owner: cagpu_user
--

COPY public.directions (id, name, description, services_count) FROM stdin;
medical	Dirección Médica	Servicios médicos y atención al paciente	12
nursing	Dirección de Enfermería	Servicios de enfermería y cuidados	8
research	Dirección de Investigación y Enseñanza	Investigación médica y formación	5
development	Dirección de Desarrollo y Vinculación Institucional	Relaciones institucionales y desarrollo	4
administration	Dirección de Administración	Gestión administrativa y recursos	7
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: cagpu_user
--

COPY public.notifications (id, title, message, user_id, service_id, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: cagpu_user
--

COPY public.services (id, direction_id, name, responsible_person, phone_extension, service_type, location, description, is_active, created_at, updated_at) FROM stdin;
cardiology	medical	Cardiología	Dr. Carlos Rodríguez	1234	clinical	Edificio A, Piso 2	Servicio especializado en diagnóstico y tratamiento de enfermedades cardiovasculares.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
neurology	medical	Neurología	Dra. Ana Martínez	1235	clinical	Edificio A, Piso 3	Atención especializada en trastornos del sistema nervioso.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
pediatrics	medical	Pediatría	Dr. Miguel Sánchez	1236	clinical	Edificio B, Piso 1	Atención médica para niños y adolescentes.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
emergency-nursing	nursing	Enfermería de Urgencias	Lic. Laura Gómez	2234	support	Edificio C, Planta Baja	Servicios de enfermería en el área de urgencias.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
intensive-care-nursing	nursing	Enfermería de Cuidados Intensivos	Lic. Roberto Díaz	2235	specialized	Edificio A, Piso 4	Cuidados de enfermería especializados para pacientes críticos.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
clinical-research	research	Investigación Clínica	Dr. Javier López	3234	specialized	Edificio D, Piso 2	Desarrollo de estudios clínicos y protocolos de investigación.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
medical-education	research	Educación Médica Continua	Dra. Patricia Flores	3235	support	Edificio D, Piso 1	Programas de actualización y formación continua para profesionales de la salud.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
institutional-relations	development	Relaciones Institucionales	Lic. Fernando Torres	4234	administrative	Edificio E, Piso 3	Gestión de relaciones con otras instituciones y organismos.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
social-service	development	Servicio Social	Lic. Mariana Vega	4235	support	Edificio E, Piso 2	Coordinación de programas de servicio social y voluntariado.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
human-resources	administration	Recursos Humanos	Lic. Gabriela Mendoza	5234	administrative	Edificio F, Piso 1	Gestión del personal y procesos administrativos relacionados.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
finance	administration	Finanzas	C.P. Héctor Ramírez	5235	administrative	Edificio F, Piso 2	Administración de recursos financieros y contabilidad.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
maintenance	administration	Mantenimiento	Ing. Ricardo Ortiz	5236	support	Edificio F, Planta Baja	Mantenimiento de instalaciones y equipos.	t	2025-06-17 02:38:46.850625	2025-06-17 02:38:46.850625
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: cagpu_user
--

COPY public.users (id, username, email, password_hash, role, first_name, last_name, department, phone, is_active, created_at, updated_at) FROM stdin;
1	admin	admin@cagpu.com	$2a$12$aUn6Tba0QlGhb9iIaLUsBuglBtQ6DhWEbFuytwrTLmTNjgrVqkc.2	admin	Admin	Sistema	TI		t	2025-06-17 02:38:46.85132	2025-06-17 13:00:13.846
2	user	user@cagpu.com	$2a$12$Wkdm58Fc38mpDt3ERCVVx.pZRScaM17WW1I9UG.T93t/MHIooYdki	user	Usuario	Demo	Médica	\N	t	2025-06-17 02:38:46.85132	2025-06-24 20:19:01.08
\.


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cagpu_user
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: cagpu_user
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: directions directions_pkey; Type: CONSTRAINT; Schema: public; Owner: cagpu_user
--

ALTER TABLE ONLY public.directions
    ADD CONSTRAINT directions_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: cagpu_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: cagpu_user
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: cagpu_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: cagpu_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: cagpu_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: cagpu_user
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: cagpu_user
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_services_direction_id; Type: INDEX; Schema: public; Owner: cagpu_user
--

CREATE INDEX idx_services_direction_id ON public.services USING btree (direction_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: cagpu_user
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: cagpu_user
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: notifications notifications_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cagpu_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cagpu_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: services services_direction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: cagpu_user
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_direction_id_fkey FOREIGN KEY (direction_id) REFERENCES public.directions(id);


--
-- PostgreSQL database dump complete
--

