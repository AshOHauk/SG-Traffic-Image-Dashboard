import { Route, Router } from '@solidjs/router';
import { lazy } from 'solid-js';
import { PageHeader } from './layouts/PageHeader';
import { SearchProvider } from './contexts/SearchContext';



function App() {
  const Home = lazy(() => import("./pages/Home"));
  const About = lazy(() => import("./pages/About"));

  return (
    <SearchProvider>
      <PageHeader />
      <div class="container overflow-y-hidden w-screen mx-auto">
        <div class="mt-16">
        <Router>
          <Route path="/SG-Traffic-Image-Dashboard/" component={Home} />
          <Route path="/SG-Traffic-Image-Dashboard/about" component={About} />
        </Router>
        <div class="text-center text-sm">Ashsiddique Omrul Hauk</div>
        </div>
      </div>
    </SearchProvider>
  );

}

export default App
