# MASTER PROMPT: BUILD ATMOS WEATHER — COMPLETE WEATHER WEB APPLICATION

Act as a senior full-stack developer, UI/UX designer, API integration specialist, and QA engineer. Build a complete, production-quality weather web application named **Atmos Weather**.

I am a beginner and do not want to manually write code. You must generate all project files, install compatible dependencies, run the application, inspect it in a browser, fix errors, and guide me through every step using simple instructions. Do not give me code snippets and expect me to assemble them manually.

## 1. PROJECT GOAL

Create a premium, modern, animated weather application that provides real weather information for cities worldwide. The application must work on desktop, tablet, and mobile.

The defining feature is a **dynamic animated background that automatically changes according to the selected city's actual weather conditions and day/night status**.

Do not build only a static mockup. All implemented features must use real data, work correctly, and have proper loading, empty, and error states.

## 2. TECHNOLOGY STACK

Use:
- React + Vite + TypeScript.
- Tailwind CSS for responsive styling.
- Lucide React for icons.
- Recharts for charts.
- Leaflet + React Leaflet for interactive maps.
- Open-Meteo APIs for weather, geocoding, air quality, and historical data where available.
- Browser LocalStorage for favourites, settings, and recent searches.
- Vercel for the primary deployment target.
- GitHub Pages as an optional alternative where compatible.

Choose compatible, stable package versions. Generate all configuration files, dependencies, lockfiles, and documentation.

Do not introduce a backend, database, paid service, or API key unless genuinely necessary and explicitly explained.

## 3. PREMIUM USER INTERFACE

Create a visually impressive interface with:
- Premium typography and spacing.
- Full-screen atmospheric backgrounds.
- Subtle gradients and glassmorphism.
- Smooth transitions.
- Animated weather illustrations.
- Readable cards and charts.
- Responsive desktop sidebar and mobile navigation.
- Light, dark, and system themes.
- Accessible contrast and keyboard navigation.
- Loading skeletons and helpful error messages.
- Consistent icons, buttons, and reusable components.

Avoid generic templates, clutter, excessive gradients, and unnecessary animations.

## 4. DYNAMIC WEATHER BACKGROUNDS — HIGHEST PRIORITY

Build a reusable React component named WeatherBackground that reacts to actual weather data.

Use the real Open-Meteo weather code and day/night information. Use the documented WMO weather-code mapping. Never use random weather, hardcoded sample conditions, or city-specific assumptions.

Create visually distinct animated themes:

- Clear daytime: bright blue sky, sunlight, subtle sun rays, and gentle atmospheric movement.
- Clear nighttime: deep navy sky, moon, subtle stars, and slow atmospheric gradients.
- Partly cloudy: drifting cloud layers with visible sunlight.
- Overcast: layered grey clouds and diffused light.
- Drizzle: light rain and fine mist.
- Rain: animated raindrops, atmospheric haze, and darker skies.
- Thunderstorm: dark storm clouds, rain, and occasional restrained lightning.
- Fog: drifting fog and reduced contrast.
- Snow: cool atmospheric colours and gently falling snow.
- Haze: warm, muted colours and soft atmospheric depth.

Requirements:
1. Automatically update the background when weather data changes.
2. Automatically distinguish day and night using the API's day/night field.
3. Update correctly when users switch cities or refresh weather.
4. Use lightweight CSS animations wherever practical.
5. Make transitions smooth, without flashes or sudden visual changes.
6. Keep weather information legible using translucent cards and appropriate overlays.
7. Respect the prefers-reduced-motion accessibility setting.
8. Avoid intense or rapid lightning flashes.
9. Optimise animations for mobile devices and low-performance computers.
10. Show a neutral background while loading or when no valid weather data exists.
11. If using a previously cached theme after an API error, clearly indicate that the data may be stale.
12. Never claim the background represents actual weather if valid data is unavailable.

Test every weather theme, day/night transition, city change, missing-data scenario, and accessibility preference.

## 5. MAIN DASHBOARD

Display real data for the selected location:
- City, region, and country.
- Current temperature.
- Weather condition and icon.
- Feels-like temperature.
- Daily minimum and maximum.
- Humidity.
- Wind speed, direction, and gusts where available.
- Precipitation probability and amount.
- UV index.
- Atmospheric pressure.
- Cloud cover.
- Visibility where supported.
- Sunrise and sunset.
- Daylight duration.
- Hourly forecast preview.
- Seven-day forecast preview.
- Last successful update time.

Every displayed measurement must come from a valid API response. Do not substitute fake values when an API request fails. Handle unavailable variables gracefully.

## 6. CITY SEARCH AND LOCATION

Implement:
- Searchable city autocomplete.
- Search across countries and regions.
- Disambiguation for cities with identical names.
- Current-location detection after explicit user permission.
- Saved favourite cities.
- Recently viewed locations.
- Configurable default city.
- Quick switching between locations.
- Search loading, no-results, and network-error states.

Use Open-Meteo Geocoding. Store only the information needed for preferences and saved locations.

## 7. HOURLY AND SEVEN-DAY FORECASTS

Hourly forecast:
- Temperature.
- Feels-like temperature.
- Weather condition.
- Precipitation probability.
- Precipitation amount.
- Wind speed and direction.
- Selectable forecast hours.
- Temperature and precipitation charts.

Daily forecast:
- Day and date.
- Weather description.
- Minimum and maximum temperatures.
- Rain probability and amount.
- Sunrise and sunset.
- Wind information where available.
- Expandable daily details.

Support appropriate time zones and daylight-saving rules. Label forecasts clearly and do not present them as guarantees.

## 8. WEATHER INSIGHTS AND CHARTS

Create detailed weather analytics pages containing:
- Temperature trends.
- Humidity and dew point.
- Rainfall and precipitation probability.
- Wind speed, direction, and gusts.
- UV index.
- Atmospheric pressure.
- Cloud cover.
- Sunrise, sunset, and daylight duration.

Use suitable Recharts visualisations with tooltips, labels, units, responsive sizing, and accessible alternatives.

Never confuse precipitation amount with precipitation probability.

## 9. INTERACTIVE WEATHER MAP

Create a complete interactive Leaflet map.

Features:
- Zoom and pan.
- Search and centre on cities.
- Current-location control.
- Click-to-inspect weather popups.
- Temperature forecast layer.
- Wind forecast layer.
- Precipitation forecast layer.
- Selectable forecast time.
- Clear legends and units.
- Fullscreen and reset-view controls.
- Responsive mobile interactions.
- Loading and provider-error handling.
- Visible map attribution.

Use genuine Open-Meteo forecast data at supported coordinates. Any raster, grid, or colour overlay must be derived from real returned data using a documented, defensible method.

Do not label forecast overlays as live weather radar. A genuine radar layer may be added only when a suitable provider is identified and its licence and free usage terms are verified.

Use a configurable map-tile provider. Follow the provider's attribution, caching, and usage policies. Do not assume public OpenStreetMap tiles permit unlimited production traffic.

## 10. AIR QUALITY

Integrate the Open-Meteo Air Quality API.

Display, when available:
- AQI with the exact index scale identified.
- PM2.5 and PM10.
- Ozone.
- Nitrogen dioxide.
- Other supported pollutants.
- Hourly air-quality trends.
- Plain-language categories and general precautions.

Never mix incompatible AQI scales. Distinguish forecast values from ground-based sensor observations.

## 11. WEATHER ALERTS

Create a weather-risk and alerts section:
- Heavy-rain risk.
- Heat-risk indicators.
- Strong-wind conditions.
- Storm-related forecast information.
- Air-quality warnings.

Clearly distinguish app-generated forecast indicators from official government warnings. Never invent official alerts.

For Indian locations, link to the official India Meteorological Department: https://mausam.imd.gov.in/

Only add browser push notifications after establishing an appropriate notification architecture and obtaining explicit permission.

## 12. WEATHER-AWARE AI ASSISTANT

Implement an assistant that answers questions using the selected location's actual weather data.

Example questions:
- Should I carry an umbrella?
- When is the best time for a walk?
- Compare Chennai and Coimbatore.
- Will tomorrow be hotter than today?
- Explain the chance of rain.

First implement a reliable rule-based assistant using real fetched data. Do not require a paid AI API for core functionality.

If an optional AI provider is added, keep its credentials server-side. Never expose private API keys in browser code. Clearly explain any usage limits or external service requirements.

## 13. CITY COMPARISON

Allow users to compare multiple cities using:
- Current temperature.
- Feels-like temperature.
- Daily highs and lows.
- Humidity.
- Wind.
- Precipitation probability.
- Weather conditions.

Display the comparisons in cards and charts. Ensure all locations use correctly converted units and their own local times.

## 14. HISTORICAL WEATHER

Integrate the official Open-Meteo Historical Weather API where appropriate.

Allow users to explore available historical temperature, precipitation, and other supported measurements.

Clearly label the data as historical observations, reanalysis, or model-derived data according to the selected endpoint. Do not describe historical reanalysis as a direct observation from a local weather station.

## 15. SETTINGS AND PERSONALISATION

Provide:
- Celsius and Fahrenheit.
- km/h, m/s, and mph.
- Millimetres and inches.
- 12-hour and 24-hour time.
- Light, dark, and system themes.
- Default city.
- Favourite locations.
- Refresh preferences.
- Language-ready architecture.

Persist settings locally. Avoid unnecessary account registration.

## 16. PWA AND SHARING

Implement:
- Progressive Web App manifest.
- Appropriate icons and installation support.
- Responsive mobile layout.
- Carefully managed caching of the application shell.
- Last successful weather data with a visible stale-data indicator.
- Shareable weather summaries.

Do not present cached data as current. Never cache API responses indefinitely or ignore provider rules.

## 17. API SOURCES AND LICENSING

Use official documentation:
- Forecast: https://open-meteo.com/en/docs
- Geocoding: https://open-meteo.com/en/docs/geocoding-api
- Air quality: https://open-meteo.com/en/docs/air-quality-api
- Historical weather: https://open-meteo.com/en/docs/historical-weather-api
- Pricing and terms: https://open-meteo.com/en/pricing
- Map tile policy: https://operations.osmfoundation.org/policies/tiles/

Display appropriate Open-Meteo attribution with a visible link.

Verify current usage limits, licences, attribution, and commercial-use terms before deployment. Do not promise unlimited free usage.

Use environment variables only where necessary. Include an example environment file without secrets. Do not put private keys in Vite client-side environment variables.

## 18. ARCHITECTURE

Organise code into:
- Page components.
- Reusable interface components.
- Weather background component.
- API service modules.
- Typed weather models.
- Weather-code mapping utilities.
- Unit conversion utilities.
- Data-fetching hooks.
- Cache management.
- Map and layer components.
- Charts.
- Theme and settings.
- Error and loading components.
- Tests.

Validate API responses, handle HTTP and network errors, cancel obsolete requests, avoid unnecessary API calls, and maintain readable, maintainable TypeScript.

## 19. ACCESSIBILITY, SECURITY, AND PERFORMANCE

Ensure:
- Keyboard navigation.
- Screen-reader labels.
- Accessible contrast.
- Visible focus indicators.
- Reduced-motion support.
- Mobile responsiveness.
- No secrets in frontend bundles.
- No unnecessary permissions.
- No excessive API requests.
- No excessive animation or memory usage.
- Clear error and recovery messages.

## 20. TESTING

Test the following:
- API integration.
- City search.
- Location permissions.
- Unit conversion.
- Time zones.
- Favourite persistence.
- Every background theme.
- Day/night transitions.
- Map layers and legends.
- Weather popup interactions.
- AQI labelling.
- API rate limits and failures.
- Missing variables.
- Mobile layouts.
- Keyboard navigation.
- Reduced-motion behaviour.
- Production build.
- Deployment configuration.

Run the build and tests. Inspect the application in a browser when available. Fix reproducible errors rather than merely reporting them.

Never claim a test passed unless it actually ran successfully.

## 21. DEPLOYMENT

Target Vercel first. Provide GitHub Pages instructions as an alternative if compatible.

Generate a complete README containing:
- Prerequisites.
- Installation instructions.
- How to launch the application.
- How to test it.
- API documentation and attribution.
- Deployment instructions.
- Known limitations.
- Feature status.

Guide me using numbered, beginner-friendly instructions. I should not need to manually write or assemble code.

## 22. IMPLEMENTATION WORKFLOW

Work in phases:

Phase 1: Inspect the workspace, create a plan, generate the React application, and build the responsive design.

Phase 2: Integrate the real weather and geocoding APIs.

Phase 3: Implement the dynamic weather backgrounds and test every weather state.

Phase 4: Add hourly and daily forecasts, charts, insights, and favourites.

Phase 5: Implement the interactive map with real forecast overlays and proper attribution.

Phase 6: Add air quality, historical data, city comparison, weather alerts, and the rule-based assistant.

Phase 7: Add PWA support, accessibility improvements, and caching.

Phase 8: Run tests, inspect the browser, fix issues, and deploy.

Begin by inspecting the workspace and presenting the plan. Then execute Phase 1. Continue through the phases without asking me to write code. Ask only when a decision requires my approval, such as destructive changes, paid services, or publishing. Clearly communicate blockers and obtain any required approvals.

## FINAL ACCEPTANCE CRITERIA

The project is complete only when the implemented features work with real data, the dynamic background responds to actual weather and day/night status, the interactive map uses correctly labelled forecast data, attribution is visible, errors are handled, the build succeeds, and deployment instructions are verified.

Provide a final checklist that separates working features, tested features, provider-dependent features, and unfinished items. Do not misrepresent progress.