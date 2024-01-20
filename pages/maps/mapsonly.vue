<script>
import { defineComponent, ref, onMounted } from "vue";
import { Marker } from "vue3-google-map";
import { useAuth } from "#imports";
// import { Marker } from "";

export default defineComponent({
  middleware: "auth",
  emits: ["position_changed", "tilt_changed"],
  components: { Marker },
  setup() {
    const center = ref({ lat: 0, lng: 0 });
    const markers = ref([]);
    const klikmarker = ref([]);
    const selectedMarker = ref(null);
    const mapInstance = ref(null); // Ref to store the map instance
    const { logout } = useAuth();

    const getCurrentLocation = () => {
      if (markers.value.length > 0) {
        // Set the center to the first marker's position
        center.value = markers.value[0].position;
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              center.value = userLocation;
              // markers.value.push({
              //   position: userLocation,
              //   label: "",
              //   title: "Your Location",
              // });
            },
            (error) => {
              console.error("Error getting location:", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }
    };

    const formInput = ref({
      // title: "",
      notes: "",
    });

    const mapWasMounted = (_map) => {
      mapInstance.value = _map;
    };

    const handleMarkerClick = (clickedMarker) => {
      const index = markers.value.findIndex(
        (marker) =>
          marker.position.lat === clickedMarker.position.lat &&
          marker.position.lng === clickedMarker.position.lng
      );

      // Check if the clicked marker has an ID
      if (!markers.value[index].id) {
        // Marker does not have an ID, remove it directly
        markers.value.splice(index, 1);
      } else {
        selectedMarker.value = {
          id: markers.value[index].id, // Add the id property
          notes: clickedMarker.notes,
          showForm: true,
        };
        $("#showmarker").show();
      }

      center.value = clickedMarker.position;

      // Manually update the map
      if (mapInstance.value) {
        mapInstance.value.setCenter(center.value);
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/maps");
        const data = await response.json();

        markers.value = data.map((map) => ({
          position: {
            lat: parseFloat(map.lat),
            lng: parseFloat(map.lng),
          },
          id: map.id,
          label: "",
          notes: map.notes,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const zoom = ref(7); // Atur level zoom awal

    const setPlace = (place) => {
      // Handle place changed event
      const selectedPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      markers.value.push({
        position: selectedPosition,
        label: "",
        title: "New Marker",
        // showForm: true,
      });
      // console.log("Place set:", place);
      center.value = selectedPosition;
      zoom.value = 16; // Atur level zoom yang diinginkan
      // You can do something with the place data if needed
    };

    const closeShowMarker = () => {
      if (markers.value.length > 0) {
        const lastMarker = markers.value[markers.value.length - 1];

        if (lastMarker.id) {
          // If the marker has an id, only hide the form
          lastMarker.showForm = false;
        } else {
          // If the marker doesn't have an id, remove it from the array
          markers.value.pop();

          // Set showForm to false for the new last marker
          if (markers.value.length > 0) {
            markers.value[markers.value.length - 1].showForm = false;
          }
        }
      }

      // Hide the showmarker element
      $("#showmarker").hide();
    };

    const data = () => {
      return {
        address: "",
      };
    };

    const getAddressFrom = (lat, lng) => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyD-2dASx5Zo68GSyZuPjUs-4SBLYGsn4OPQ`;

      axios
        .get(url)
        .then((response) => {
          if (response.data.error_message) {
            console.log(response.data.error_message);
          } else {
            this.address = response.data.results[0].formatted_address;
          }
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    onMounted(async () => {
      fetchData();
      getCurrentLocation();
      // handleMarkerClick();
      // $("#showmarker").hide();
    });

    return {
      zoom,
      center,
      markers,
      setPlace,
      formInput,
      klikmarker,
      mapWasMounted,
      handleMarkerClick,
      closeShowMarker,
      selectedMarker,
      logout,
    };
  },
});
</script>

<template>
  <div class="text-center mx-auto relative">
    <div class="absolute z-10 pt-8 left-[30%]">
      <h1 class="text-2xl font-semibold pb-2 text-center">Your Coordinate :</h1>
      <p>{{ center.lat }} Latitude, {{ center.lng }} Longitude</p>
    </div>
    <button
      @click="logout"
      class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded absolute z-40"
    >
      Logout
    </button>
    <GMapMap
      api-key="AIzaSyD2dASx5Zo68GSyZuPjUs-4SBLYGsn4OPQ"
      id="google-map"
      style="width: 100%; height: 100vh"
      :center="center"
      :zoom="zoom"
      @load="mapWasMounted"
    >
      <GMapMarker
        :clickable="true"
        v-for="marker in markers"
        :key="marker.position.lat + marker.position.lng"
        :options="marker"
        @click="() => handleMarkerClick(marker)"
      />
      <div class="absolute right-16 top-[9px]">
        <GMapAutocomplete
          placeholder="Search"
          @place_changed="setPlace"
          class="px-4 py-2 w-[512px] border rounded-md focus:outline-none focus:ring focus:border-blue-300 shadow-sm"
        >
        </GMapAutocomplete>
      </div>
      <div
        v-if="markers.length && markers[markers.length - 1].showForm"
        class="absolute z-10 inset-1/2 transform translate-x-8 -translate-y-40"
      ></div>
      <div
        id="showmarker"
        :data-id="selectedMarker ? selectedMarker.id : ''"
        class="absolute z-10 inset-1/2 transform translate-x-8 -translate-y-40"
        style="display: none"
      >
        <div class="bg-white w-72 h-auto rounded-md p-8 relative">
          <form @submit.prevent="editSaveFormData" disa>
            <label for="notes">Description:</label>
            <textarea id="notes" class="w-full mb-2 p-2 border" disabled
              >{{ selectedMarker ? selectedMarker.notes : "" }} </textarea
            >
            <!-- <textarea
              v-model="address"
              id="notes"
              class="w-full mb-2 p-2 border"
              disabled
            >
            </textarea> -->
          </form>
          <div class="absolute top-0 right-1">
            <button
              @click="closeShowMarker"
              class="absolute top-2 right-2 text-red-500 hover:text-red-700 cursor-pointer"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </GMapMap>
  </div>
</template>
