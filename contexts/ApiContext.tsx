import { FeatureCollection, Point } from "geojson";
import React, { useEffect, useState } from "react";

export type TechnologyProblems =
  | "technology"
  | "artificial intelligence"
  | "augmented reality";

export type HealthProblems =
  | "health"
  | "medicine"
  | "well-being"
  | "spirituality"
  | "exercise";

export type EnvironmentalProblems =
  | "environment"
  | "pollution"
  | "water-pollution"
  | "air-pollution"
  | "deforestation"
  | "endangered-species";

export type SocietalProblems =
  | "society"
  | "culture"
  | "history"
  | "poverty"
  | "obesity";

export type HumanitarianProblems =
  | "humanitarian"
  | "charity"
  | "disaster-relief"
  | "humanitarian-aid";

export type ProblemSpace =
  | TechnologyProblems
  | EnvironmentalProblems
  | HealthProblems
  | SocietalProblems
  | HumanitarianProblems;

export interface Project {
  id: string;
  name: string;
  tags: ProblemSpace[];
  contents: string;
  imageUrls: string[];
  projectLeadId: string;
  proposedSolution?: ProjectSolution;
  forkedFromProjectId?: string;
}

export interface ProjectSolution {
  status:
    | "abandoned"
    | "unknown"
    | "looking-for-collaborators"
    | "looking-for-volunteers"
    | "raising-funds"
    | "research-and-development"
    | "active-development"
    | "mass-market";
  lastUpdated: Date;
  callToActionUrl: string;
}

export interface ProjectAnchor {
  id: number;
  name: string;
  date: Date;
  projectId: string;
  latitude: number;
  imageUrl?: string;
  longitude: number;
  relevance: number;
  description: string;
  impactRange: "location" | "neighbourhood" | "state" | "country" | "continent";
  callToActionUrl?: string;
}

const dummyProjects: Project[] = [
  {
    id: "101dalmations",
    name: "101 Dalmation Charity Project",
    tags: ["history", "culture"],
    imageUrls: [
      "https://placekitten.com/200/300",
      "https://placekitten.com/300/200",
    ],
    projectLeadId: "cruella",
    contents: `# Has sunt tuta frontem carmen reus somnos

## Nec sic pavidum liquit

Lorem markdownum fortunaque vaga: nec, materno permansit futurum versat. Carina
dum reluxit inter summam detestatur undis, Gryneus, telum vobis ille lacrimis?
Tam filis in nequiquam, molle quies, furialibus bracchia et Circes corpore
rictus repugnat, torrentis pisce si.

1. Muneris tremescere Stygia sitim dixisse
2. O adhuc deus auxerunt
3. Non si attollere circuit campis

Nihil sive tendens iuvenem: nos nox mutatum non currere non sidere negaretur
versato: ubi ducis. Mors corna, quo latus, greges sollicitat, acie desuetas
furit; suo Dryope nollet facientibus criminis Iove! Situ numina glomerataque
huic fugiant sceptri: relinquam neque, foramine senecta?

## Tamen nec parva rogant pallentia toto sed

Postquam nudans tulisti nymphas effugit et Antiphataeque rapidi senem posuisset
cauda, iam. Possit tantoque cepit tantum facti nubibus vocet *venientis* non
est; fiducia, fatebere sequentis essem annorum pulveris contingere. Quae fulgore
duo aut iuncta natumque Iuppiter **silvas** tophis si matrum et audenti lacus
praemia fauces et vides [crescentesque quod](http://colores.io/praedae).

    var copy = gibibyte_windows;
    var mysql_unmount_lag = www.disk(4 + copyrightOutput + flatbed,
            interfaceControllerDos(5, dacServer(1), drive));
    var key = 29;

## Nullum ubi media pater hamato ardua nota

Ultima meritam, stetit in suam falsa aureus corpore, Rutulos. Quod sit serpentis
epulas quis posuit terga Stygio gravem. Ferre habet perdet, honore, qui speciem
sequendo cum. Omnesque illa Doridaque tacet ab genitor, suas meae ex quis sic
capillis pigre temerare.

1. Parente vita quoque facit nata carinas dolosae
2. Procis in ore sedit
3. Mea terras agresti tamen respiceret fornace est

Fluvios accipit, clausa, et latebra iunget; victus motu, Thracum coepta
queruntur nec fervoribus. *Poterat qua partus*, moenia conatibus lintea.
*Durescit* sic subnixa tamen *saxum*, et capillos cerebrum ferarum **o** mundi,
cum Hypaepis devenit oraque.

Maturus resolvo tamen. Rata non nam suo inpositum dederant illa pavidamque
quaerit venenis erat moenia in demisere. Fixit Metione **magno** edendi gaudete
bos dapes erit accepit, ut memorant locique saeva. Angues Nereusque terras
meroque Iuno. Praesens **quid** alias Thoactes, flavus Phoebeius distat, quae
sidus exierint lacertis.`,
  },
  {
    id: "ismywaterdirty",
    name: "Is my Water Dirty?",
    tags: ["technology"],
    imageUrls: [
      "https://placekitten.com/200/350",
      "https://placekitten.com/350/200",
      "https://placekitten.com/250/250",
    ],
    projectLeadId: "waterboy",
    forkedFromProjectId: "101dalmations",
    contents: `# Manus mei ut

## Summa magnum qualis

Lorem markdownum Iason; potenti lucus tenentis, turis inminet audet. Pedum puer
pendet figuras quae, est est ingens sensim; sed et villo maiora movet rubefecit.
Faece promisistis mirabile victor, pro atque digitis gestumque terrenae:
gemitum. Ebur nostro ore frondes talibus cunctaque germane; laesa cum ventrem
Rhodosque! Viscera cornigeris Musa ferunt, misit mandata mercede
[venit](http://www.hac.com/nobis.aspx) populo, tibi sacra modum supplex.

    if (3) {
        megapixel /= transfer_voip_transistor - version + 5;
        tagStreaming = vlb;
    }
    tebibyte_core_cable = software * adf_spreadsheet + processMenu - memory;
    driverDll(it_iteration_snmp - cut(configurationMatrixArray,
            resources_autoresponder, tunneling_wysiwyg_screenshot),
            bash_home_imap + definitionCtrMysql.sdBrouterApple(-2,
            myspaceRowIsp, -4));
    if (dvi_internet_up(5, andGatewayReality, fileQuicktimeOpen) != 2) {
        vector = bashPage + token;
        ssid.computer_opengl_point.bankruptcy_skyscraper(registry, digital);
        manet = virus_mips_encoding;
    } else {
        errorExternalDbms(driverSafe, prebinding);
        circuit.passwordJspError = 5;
    }

## Per navigiis

Iugeribus se laboris pallent vixque nymphas Cecropio adest mora bicorni; in
tinxit: mihi frater pavido perque colloque. Lapsis Hypaepis pressum valebam
miratur, spatium in falsa gerens, sors cuncta quod! Ante morte, quid Iove opem
**iurare** ab regia hic sit, requies. Hoc vocem muneris Romule motu sibi, vincta
ab non in donec conubia contraxit, serpens Emathiique; bucina et? Pontum quoque,
virentes famulis prisca coniugis ait amplexus quae, non per, per.

- Ab non cremet sum bracchia virum
- Iussis aestibus et taxo levati expertus medias
- Lyncus tempore magnis
- Praestantior nec reperta colore
- Vis una traiecti regia
- Boves et

## Effecere rauca ignisque suorum meminitque pavet leto

Piasque humus patrium flammam electra vestrum, sollicita tum [dictis voto
nodosque](http://www.moticamini.org/) placet. Indice *factorum* versuta sic: iam
deae volentes fertilis sacrataque.

## Iram mediumque carens fidissime dracones perdidit

Monebat cum pone sub Trachine [conspicit
dicta](http://altoaeoliique.io/domossummas.php) et obortis lentus, pennis
accipitrem quinque prendique regina ferus caput. Et confido pharetrae laudando
timidissime ab poma novissima abiit conrepta quae de ignis. Inmeritam Scorpion.

> **Enim sonat** veniensque, vel cladibus regnumque et Agenore ipsa mihi inque
> ambobus tumidisque, quem viri excipit. Ex **nollem flammis** et numina
> [inmotus victoris](http://pars.org/) vocatur *stetit*. Nebulas tum in hunc
> *cui* tenore omne nobilitate praemia costumque petiere gentisque **cepit
> aquarum**.

**Orbis quibus** nec quo iuxta ut Minyeides [nova
vipereos](http://www.et-lacrimas.com/quique.html), Ausonio Proca ut velox!
Litora Periphanta Cyane non dabat plumbum ignotae, Aurorae et potens, sed virago
illas.`,
  },
  {
    id: "bugburgers",
    name: "Bringing Bug Burgers to Mass Production",
    tags: ["technology", "pollution"],
    projectLeadId: "mcdonerds",
    imageUrls: [
      "https://placekitten.com/200/350",
      "https://placekitten.com/350/200",
      "https://placekitten.com/250/250",
    ],
    contents: `# Functaque exitium numina rursusque licet et optat

## Acasto Hectoris si terras factae in casu

Lorem markdownum inania Iuppiter sustinet stimuletur levi: credas *me comas*,
Pergama, ingemuit, non. Mulces in percussit captare rapta illis, resistunt tunc.
Ille flores gratantur iuvenum, quae, sequitur Amphrysos concilio te erit,
flatuque quia.

1. Uvis casus sumpsisse luctus canis nec novus
2. Animam recenti vicinia
3. Guttura coruscis
4. Iam sua obruta sordidus inhaesi
5. Quod qua pompae haec quamvis delphina formae
6. Vellem opifer barbarus turbavere

## Potiunda tamen occupat caelo

*Nata ecce* vadit nostrum Calydon fugaverat tremebunda quae. Nota monte
[pia](http://ut.io/numen-tergoque) vero maesto, veteris una trans ossibus?
Induit se aberat ter alter meminisse ad exhalat [quibus
matrum](http://perfectaque-modo.com/) nec petiisse amore? Nox mea dicere mundo
etiam erit dedisses demisso aequora!

## Hectoris lactis recessit Hyries aequoris lunaria a

Sub Acasto quoque moritura, effugit, genitis a honore cetera? In *similes vocem
hac*, Cebrenida pascua scrobibus vel arbore, Ante. Se quoque habebis fecit:
credens viribus currusque retinens: intrare gentis obliqua longius, timidis.
Suas puppe exclamat; quid aras Hectora ignis fixa **cernit anguem**.

## Silva duabus simul

Desierant Peleu, Oebalio et oracula hoc avertitur adhuc Cephesidas. Suco dixit
alipedis haec. Levabere petit, non increvit guttur maturus Peleus.

> Pro ille sororia. Usque socio Cupido ut citharae sanguine. Ausonia firmatque
> quam ante obruta a omnia cum culpae mores visa? Ipso iaculum bipenni sceleri
> ususabstrahit pretium Psamathen qua illic, ore. Aberat consumpserat optat ne
> unum, at Agenore resolvit luridus Tereus sceleratior ducere sequerer et radere
> digitosque rarus vitiis.

## Rubent potum et leto

Nescia amicitiae, amens satis fretum, neganda thalamos est terra praestate.
Hortatibus et non et inpubibus mixtus inter, uvis tectum illas procumbere ausa
frugum refers. Cum cum puer, sunt tauro, quoque hanc remigis moderantum illi
candida [medium](http://materiaque-doloris.com/flamina) avidos. Iussit contigit
ore pepercit posita deam aequore figentem pater, habet memoraverit fidae.

Cum imis videns talia vocem spatium, qui qui hippomene duc. Que ardor pia media
de possidet ulterius calidus pennae, frustra curis mihi terrae venit dextera?`,
  },
];

const dummyAnchors: ProjectAnchor[] = [
  {
    id: 10011,
    projectId: "101dalmations",
    name: "101 Dalsss",
    date: new Date(),
    latitude: 51.50236196150672,
    longitude: -0.1372241323820363,
    relevance: 0,
    description: "101 Dalmations was filmed somewhere here",
    impactRange: "location",
    imageUrl: "https://placekitten.com/300/300",
  },
  {
    id: 10101,
    name: "201 Dalsss???",
    projectId: "101dalmations",
    date: new Date(),
    latitude: 51.535155002420964,
    longitude: -0.04049294793464195,
    relevance: 0,
    description: "101 Dalmations was also filmed somewhere here",
    impactRange: "location",
    imageUrl: "https://placekitten.com/400/300",
  },
  {
    id: 2201010,
    name: "Filthy water everywhere!",
    projectId: "ismywaterdirty",
    date: new Date(),
    latitude: 51.494600633637354,
    longitude: 0.5534795285052225,
    relevance: 0,
    description: "checking if this is dirty",
    impactRange: "state",
    imageUrl: "https://placekitten.com/400/500",
  },
  {
    id: 201334,
    name: "Gosh it cant be filthy here too!",
    projectId: "ismywaterdirty",
    date: new Date(),
    latitude: 52.60991649105231,
    longitude: 5.27352955440632,
    relevance: 0,
    description: "still checking if this is dirty",
    impactRange: "country",
    imageUrl: "https://placekitten.com/400/400",
  },
  {
    id: 102314,
    name: "I like bugs",
    projectId: "bugburgers",
    date: new Date(),
    latitude: 24.238294578468107,
    longitude: 106.5344972908355,
    relevance: 0,
    description: "bringing bug burgers to Asia",
    impactRange: "continent",
    imageUrl: "https://placekitten.com/300/300",
  },
  {
    id: 11303012,
    name: "Cockroaches are especially yummy",
    projectId: "bugburgers",
    date: new Date(),
    latitude: 8.788828652868984,
    longitude: 19.69856197477612,
    relevance: 0,
    description: "bringing bug burgers to Africa",
    impactRange: "continent",
    imageUrl: "https://placekitten.com/400/300",
  },
];

interface Api {
  query: () => void;
}

const ApiContext = React.createContext(null);

export const ApiContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ApiContext.Provider value={null}>{children}</ApiContext.Provider>;
};

export interface ApiResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useProjectQuery(projectId?: string, anchorId?: number) {
  const [result, setResult] = useState<
    ApiResult<{
      project: Project;
      anchor?: ProjectAnchor;
      anchors: ProjectAnchor[];
    }>
  >({ loading: true });
  const debouncedRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debouncedRef.current) {
      clearTimeout(debouncedRef.current);
    }

    if (!projectId) {
      setResult({ loading: false });
      return;
    }

    (debouncedRef as any).current = setTimeout(async () => {
      const project = dummyProjects.find((p) => p.id === projectId)!;
      const anchors = dummyAnchors.filter((a) => a.projectId === projectId);
      const anchor = anchorId
        ? anchors.find((a) => a.id === anchorId)
        : undefined;

      setResult({
        data: { project, anchors, anchor },
        loading: false,
      });
    }, 1000);
  }, [debouncedRef, anchorId, projectId]);

  useEffect(() => {
    setResult({ loading: true });
  }, [projectId, anchorId]);

  return result;
}

export function useProjectsQuery({
  skip,
  search,
}: {
  skip?: boolean;
  search?: string;
}) {
  const [result, setResult] = useState<ApiResult<Project[]>>({ loading: true });
  const debouncedRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debouncedRef.current) {
      clearTimeout(debouncedRef.current);
    }

    if (skip) {
      setResult({ loading: false });
      return;
    }

    (debouncedRef as any).current = setTimeout(async () => {
      let filtered = dummyProjects;

      if (search) {
        const normalizedSearch = search.toLowerCase();
        filtered = filtered.filter(
          (project) =>
            project.name.toLowerCase().includes(normalizedSearch) ||
            project.tags.some((tag) => tag.includes(normalizedSearch))
        );
      }

      setResult({
        data: filtered,
        loading: false,
      });
    }, 1000);
  }, [debouncedRef, search, skip]);

  useEffect(() => {
    setResult({ loading: true });
  }, [search]);

  return result;
}

const MAX_RELEVANCE = 10;

export interface ProjectAnchorsQueryParams {
  date?: Date;
  search?: string;
  tags?: ProblemSpace[];
  zoom?: number;
}

export function useProjectAnchorsQuery({
  date,
  search,
  tags,
  zoom,
}: ProjectAnchorsQueryParams) {
  const [result, setResult] = useState<
    ApiResult<FeatureCollection<Point, ProjectAnchor>>
  >({
    loading: true,
  });
  const debouncedRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debouncedRef.current) {
      clearTimeout(debouncedRef.current);
    }

    console.log("DO SOMETHING HERE", debouncedRef.current, search, tags);

    (debouncedRef as any).current = setTimeout(async () => {
      let filtered = dummyAnchors;

      if (tags) {
        filtered = filtered.filter((anchor) => {
          const project = projectWithId(anchor.projectId);

          return project?.tags.some((tag) => tags.includes(tag));
        });
      }

      const data: FeatureCollection<Point, ProjectAnchor> = {
        type: "FeatureCollection",
        features: filtered.map((anchor) => {
          // const searchPenaltyFactor = !search ? 1 : anchor;
          return {
            id: anchor.id,
            type: "Feature",
            properties: { ...anchor, relevance: MAX_RELEVANCE },
            geometry: {
              type: "Point",
              coordinates: [anchor.longitude, anchor.latitude],
            },
          };
        }),
      };

      (debouncedRef as any).current = null;
      setResult({
        data,
        loading: false,
      });
    }, 1000);
  }, [debouncedRef, search, tags]);

  useEffect(() => {
    setResult({ loading: true });
  }, [search, tags]);

  return result;
}

function projectWithId(id: string) {
  return dummyProjects.find((project) => project.id === id);
}
