import Card from '../components/Card'
import { onMount, createSignal } from 'solid-js';
import { useSearch } from '../contexts/SearchContext';
import { MapIcon } from "lucide-solid"
import { Button } from "../components/Button"
import Modal from '../components/Modal';
import cameraData from '../data/cameraData';

async function fetchRouteName(lat: number, lng: number): Promise<string> {
  const cacheKey = `routeName:${lat},${lng}`;
  // Try to get the cached route name from sessionStorage
  const cachedRouteName = sessionStorage.getItem(cacheKey);
  if (cachedRouteName) {
    return cachedRouteName;
  }

  // If not in cache, fetch from API
  const response = await fetch(`https://sg-traffic-backend-ashohauk.onrender.com/api/onemap/route-name?lat=${lat}&lng=${lng}`);
  const json = await response.json();
  console.log(json);

  let routeName = json.GeocodeInfo[0]?.ROAD ?? 'Unknown';
  // Cache the result in sessionStorage
  sessionStorage.setItem(cacheKey, routeName);
  return routeName;
}

function fetchRouteNameByID(id: string): string {
  return cameraData[id] || 'Unknown Camera ID';
}

interface Camera {
  ImageLink: string;
  CameraID: string;
  Latitude: number;
  Longitude: number;
}
interface CameraWithRoute extends Camera {
  routeName?: string;
}

interface Incident {
  Latitude: number;
  Longitude: number;
  Message: string;
  Type: string;
}

interface IncidentWithRoute extends Incident {
  routeName?: string;
}

interface ApiResponse {
  value: Camera[];
}

interface IncidentsApiResponse {
  value: Incident[];
}

interface IncidentTypeColors {
  [key: string]: string;
}


export default function Home() {
  const [data, setData] = createSignal<CameraWithRoute[]>([]);
  const [loadedImages, setLoadedImages] = createSignal(new Map());
  const [incidents, setIncidents] = createSignal<IncidentWithRoute[]>([]);
  const { search } = useSearch()!;
  onMount(() => {
    updateData();
    updateIncidents();
    const intervalId = setInterval(updateData, 60 * 1000);
    return () => clearInterval(intervalId);
  });

  const incidentTypeColors: IncidentTypeColors = {
    'Accident': 'border-l-red-500 border-8',
    'Roadwork': 'border-l-yellow-400 border-8',
    'Vehicle breakdown': 'border-l-yellow-500 border-8',
    'Weather': 'border-l-blue-300 border-8',
    'Obstacle': 'border-l-orange-600 border-8',
    'Road Block': 'border-l-red-700 border-8',
    'Heavy Traffic': 'border-l-orange-500 border-8',
    'Misc.': 'border-l-gray-500 border-8',
    'Diversion': 'border-l-green-500 border-8',
    'Unattended Vehicle': 'border-l-purple-500 border-8',
  };



  async function updateData() {
    try {
      const response = await fetch('https://sg-traffic-backend-ashohauk.onrender.com/api/traffic/images');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json: ApiResponse = await response.json();
      const cameras = json.value;

      // Preload images and update route names
      const camerasWithPreloadedImages = await preloadImagesAndUpdateRouteNames(cameras);

      // Sort cameras by camera_id in increasing order
      camerasWithPreloadedImages.sort((a, b) => a.CameraID.localeCompare(b.CameraID));
      setData(camerasWithPreloadedImages); // Set data with preloaded images and updated route names
    } catch (error) {
      console.error("Fetching data failed:", error);
    }
  }

  const preloadImagesAndUpdateRouteNames = async (cameras: Camera[]): Promise<CameraWithRoute[]> => {
    const currentLoadedImages = new Map(loadedImages());

    const updatedCameras = await Promise.all(cameras.map(async (camera) => {
      // Check if the image URL has changed
      if (currentLoadedImages.get(camera.CameraID) !== camera.ImageLink) {
        // Preload image
        await preloadImage(camera.ImageLink);
        // Update the local copy of loadedImages
        currentLoadedImages.set(camera.CameraID, camera.ImageLink);
      }

      // Fetch route name
      const routeName = fetchRouteNameByID(camera.CameraID);

      return { ...camera, routeName };
    }));

    // Update the state with the new image URLs after all promises are resolved
    setLoadedImages(currentLoadedImages);
    return updatedCameras;
  };

  // Function to preload a single image
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(); // Wrap resolve in a function that takes no arguments
      img.onerror = (event) => reject(event); // Pass the event object to reject
    });
  };

  async function updateIncidents() {
    try {
      const url = 'https://sg-traffic-backend-ashohauk.onrender.com/api/traffic/incidents';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json: IncidentsApiResponse = await response.json();
      const incidents = json.value;

      // update route names
      const incidentsWithRouteNames = await updateIncidentRouteNames(incidents);

      setIncidents(incidentsWithRouteNames); // Set data with updated route names
    } catch (error) {
      console.error("Fetching data failed:", error);
    }
  }

  const updateIncidentRouteNames = async (values: Incident[]): Promise<IncidentWithRoute[]> => {
    const updatedIncidents = await Promise.all(values.map(async (incident) => {
      // Fetch route name
      const longitude = incident.Longitude;
      const latitude = incident.Latitude;
      const routeName = await fetchRouteName(latitude, longitude);

      return { ...incident, routeName };
    }));
    return updatedIncidents;
  };

  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [currentCamera, setCurrentCamera] = createSignal<CameraWithRoute | null>(null);

  const openModal = (camera: CameraWithRoute) => {
    setCurrentCamera(camera);
    setIsModalOpen(true);
    console.log("button click", camera, isModalOpen())
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };



  return (
    <div class="flex flex-row items-start gap-5 px-10 relative">
      <div class="grid auto-rows-max grid-cols-2 row-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-auto h-fullwindow min-h-[500px] w-full">
        {data().filter((camera) =>
          camera.routeName?.toLowerCase().includes(search().toLowerCase()) ||
          camera.CameraID.toLowerCase().includes(search().toLowerCase())).length > 0 ? (
          data().filter(
            (camera) =>
              camera.routeName?.toLowerCase().includes(search().toLowerCase()) ||
              camera.CameraID.toLowerCase().includes(search().toLowerCase())
          ).map(
            camera => (
              <Card rounded={true} flat={false} padded={false} id={`camera-${camera.CameraID}`}>
                <div class="relative">
                  <img
                    src={camera.ImageLink}
                    alt={`Traffic Camera ${camera.CameraID}`}
                    class="h-32 w-full object-cover rounded-t-md"
                    loading="lazy"
                  />
                  <Button variant="translucent" size="icon" class="absolute bottom-0 right-0" onClick={() => openModal(camera)}>
                    <MapIcon />
                  </Button>
                </div>
                <div class="text-sm font-bold py-1 px-1">{camera.routeName}</div>
                <div class="text-xs">Camera {camera.CameraID}</div>
              </Card>
            ))) : (
          <div class="text-center py-10 col-span-full max-w-full">
              
          </div>
        )}
      </div>
      <div class="w-1/4 h-fullwindow relative hidden lg:block">
        <div class="absolute inset-0 overflow-auto space-y-4">
          {incidents().map((incident) => (
            <Card rounded={true} flat={false} padded={true} id={`incident-${incident.Message}`} className={`${incidentTypeColors[incident.Type]}`}>
              <div class="font-bold">{incident.Type}</div>
              <div class="text-sm font-bold">{incident.routeName}</div>
              <div class="text-sm">{incident.Message}</div>
            </Card>
          ))}
        </div>
      </div>

      {isModalOpen() && (
        <Modal
          isOpen={isModalOpen()}
          onClose={closeModal}
          title={currentCamera()?.routeName ?? 'Unknown'}
        >
          <div class="flex">
            <img
              src={currentCamera()!.ImageLink}
              alt={`Traffic Camera ${currentCamera()!.CameraID}`}
              class="w-1/2 object-cover" // Adjust width as necessary
              loading="lazy"
            />
            <iframe
              src={`https://www.onemap.gov.sg/minimap/minimap.html?mapStyle=Original&zoomLevel=15&latLng=${currentCamera()?.Latitude},${currentCamera()?.Longitude}`}
              class="w-1/2 h-auto" // Set width to half of the container, height auto-scales
            ></iframe>
          </div>
        </Modal>
      )}
    </div>
  );
}