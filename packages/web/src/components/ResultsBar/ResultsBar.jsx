import { useContext, useCallback, useState, useEffect, useRef } from "react";
import "./ResultsBar.css";
import ResultCard from "../ResultCard/ResultCard";
import { Box, Flex, Text, Button, IconButton } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import DataContext from "../../context/DataContext";
import { UserAuth } from "../../context/AuthContext";
import Fuse from "fuse.js";

import { filterItem } from '../../utils/Utils.js';

export default function ResultsBar({
  search,
  findFilter,
  setFocusLocation,
  onResultsBarClose,
  setLeaderboard,
}) {
  const { data, setData } = useContext(DataContext);
  const { user } = UserAuth();

  const filterItemCallback = useCallback(
    (item) => filterItem(item, findFilter, user),
    [findFilter, user]
  );

  const mapItem = useCallback(
    (item) => (
      <Box
        key={item.location}
        onClick={() => {
          setFocusLocation(item.location);
        }}
        _hover={{ transform: "scale(0.99)" }}
        transition="transform .3s ease"
      >
        <ResultCard
          props={item}
          setData={setData}
          onResultsBarClose={onResultsBarClose}
          setLeaderboard={setLeaderboard}
        />
      </Box>
    ),
    [setFocusLocation, onResultsBarClose, setData, setLeaderboard]
  );

  const searchItemsOptions = {
    keys: ["name", "description"],
    threshold: 0.3, // Lower threshold for stricter matching
    includeScore: true, // To check relevance of matches
  };

  const fuse = new Fuse(data, searchItemsOptions);
  const results = fuse.search(search).map((result) => result.item);

  let allResults =
    search === ""
      ? data.filter(filterItemCallback).map(mapItem)
      : results.filter(filterItemCallback).map(mapItem);



  // Display only the 10 items on the screen and only 4 buttons (the last one is always there)
  const itemsOnScreenLimit = 10;
  const buttonLimit = 3;

  const [selectedPageNumber, setSelectedPageNumber] = useState(1);
  const [paginationButtons, setPaginationButtons] = useState([])
  const [viewableResults, setViewableResults] = useState([])
  const resultsBarRef = useRef(null);

  const changeViewToNewPage = useCallback((newSelectedPage) => {
    const pageStart = (newSelectedPage * itemsOnScreenLimit) - itemsOnScreenLimit
    const pageEnd = Math.min((newSelectedPage * itemsOnScreenLimit), allResults.length)

    setViewableResults(allResults.slice(
      pageStart,
      pageEnd
    ));
    resultsBarRef.current.scrollTo({
      top: 0,
    });
  }, [allResults, allResults.length]);

  const updatePaginationButtons = useCallback(
    (newSelectedPage) => {
      changeViewToNewPage(newSelectedPage);
      setSelectedPageNumber(newSelectedPage);

      const maxIndex = Math.floor(allResults.length / itemsOnScreenLimit) + 1;
      if (newSelectedPage >= maxIndex - buttonLimit) {
        setPaginationButtons(createPaginationButtons(maxIndex - buttonLimit, newSelectedPage));
      }
      else {
        const startPage = newSelectedPage - ((newSelectedPage - 1) % 3);
        setPaginationButtons(createPaginationButtons(startPage, newSelectedPage));
      }
    },
    [allResults, allResults.length, changeViewToNewPage]
  )
  const PageButton = useCallback(({ keyProp, selected }) => (
    <Button
      onClick={() => updatePaginationButtons(keyProp)}
      key={keyProp}
      variant={selected ? "solid" : "outline"}

      colorScheme="blue"
      width="40px"
      height={"40px"}
      marginTop="10px"
      marginBottom="10px"
      fontSize={"xl"}
    >
      {keyProp}
    </Button>
  ), [updatePaginationButtons]);

  function createPaginationButtons(startPageNumber, selectedPageNumber) {
    const buttons_array = [];
    for (let i = startPageNumber; i < startPageNumber + buttonLimit; i++) {
      buttons_array.push(<PageButton keyProp={i} selected={i == selectedPageNumber} />);
    }
    return buttons_array;
  }


  const handlePageArrowClick = useCallback((direction) => {
    const maxIndex = Math.floor(allResults.length / itemsOnScreenLimit) + 1

    let startPage = 0;
    let selected = 0;
    if (direction == "right" && selectedPageNumber < maxIndex) {
      if (selectedPageNumber >= maxIndex - buttonLimit) {
        startPage = maxIndex - buttonLimit;
        selected = maxIndex;
      }
      else {
        startPage = selectedPageNumber + (3 - ((selectedPageNumber - 1) % 3));
        selected = selectedPageNumber + 3;
        if (startPage > maxIndex - buttonLimit)
          startPage = maxIndex - buttonLimit;
      }

      setSelectedPageNumber(selected);
      changeViewToNewPage(selected);
      setPaginationButtons(createPaginationButtons(startPage, selected));
    }
    else if (direction == "left" && selectedPageNumber > 0) {
      if (selectedPageNumber <= 3) {
        startPage = 1;
        selected = 1;
      }
      else if (selectedPageNumber == maxIndex) {
        startPage = maxIndex - 4;
        selected = maxIndex - 4;
      }
      else {
        startPage = selectedPageNumber - (3 + (selectedPageNumber - 1) % 3);
        selected = selectedPageNumber - 3;
      }

      setSelectedPageNumber(selected);
      changeViewToNewPage(selected);
      setPaginationButtons(createPaginationButtons(startPage, selected));
    }
  }, [allResults, allResults.length, selectedPageNumber])



  const firstRender = useRef(true);
  useEffect(() => {
    if (!firstRender.current || allResults.length === 0)
      return;

    firstRender.current = false;
    const pageStart = (selectedPageNumber * itemsOnScreenLimit) - itemsOnScreenLimit
    const pageEnd = Math.min((selectedPageNumber * itemsOnScreenLimit), allResults.length)

    setViewableResults(allResults.slice(
      pageStart,
      pageEnd
    ));
    setPaginationButtons(createPaginationButtons(1, 1));
  }, [allResults])


  // Define JSX for empty results bar (no result cards)
  const noResults = (
    <Flex height="80%" width="100%" justifyContent="center" alignItems="center">
      <Text fontSize="4xl" as="b" color="gray">
        No Items
      </Text>
    </Flex>
  );

  return (
    <Box
      paddingX="5px"
      paddingY="20px"
      width={{ base: "30vw", md: "21vw" }}
      height="80vh"
      overflowY="scroll"
      overflowX="hidden"
      ref={resultsBarRef}
    >
      {allResults.length > 0 ? viewableResults : noResults}
      <Box width="100%" display="flex" justifyContent={"space-between"}>
        <IconButton icon={<ChevronLeftIcon />} height="40px" width="10px" marginTop="10px" marginBottom="10px" onClick={() => handlePageArrowClick("left")} />
        {paginationButtons}
        <PageButton keyProp={Math.floor(allResults.length / 10) + 1} selected={Math.floor(allResults.length / 10) + 1 == selectedPageNumber} />
        <IconButton icon={<ChevronRightIcon />} height="40px" width="10px" marginTop="10px" marginBottom="10px" onClick={() => handlePageArrowClick("right")} />
      </Box>
    </Box>
  );
}
