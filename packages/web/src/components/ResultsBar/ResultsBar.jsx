import { useContext, useCallback, useState, useEffect, useRef } from "react";
import "./ResultsBar.css";
import ResultCard from "../ResultCard/ResultCard";
import { Box, Flex, Text, Button, useToast } from "@chakra-ui/react";
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

  const [itemsonScreenLimit, setItemsOnScreenLimit] = useState(10);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const resultsBarRef = useRef(null);

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

  const handleLoadMore = useCallback(() => {
    setItemsOnScreenLimit(itemsonScreenLimit + 10);
  }, [itemsonScreenLimit]);

  const loadMoreButton = (
    <Button
      onClick={handleLoadMore}
      variant="outline"
      colorScheme="blue"
      width="100%"
      height={"80px"}
      marginTop="10px"
      marginBottom="10px"
      fontSize={"xl"}
    >
      Load More
    </Button>
  );

  const viewableResults = allResults.slice(
    0,
    Math.min(itemsonScreenLimit, allResults.length)
  );

  const noResults = (
    <Flex height="80%" width="100%" justifyContent="center" alignItems="center">
      <Text fontSize="4xl" as="b" color="gray">
        No Items
      </Text>
    </Flex>
  );

  useEffect(() => {
    let scrollInterval;
    if (isAutoScrolling && resultsBarRef.current) {
      scrollInterval = setInterval(() => {
        if (resultsBarRef.current.scrollTop + resultsBarRef.current.clientHeight < resultsBarRef.current.scrollHeight) {
          resultsBarRef.current.scrollTop += 1;
        } else {
          resultsBarRef.current.scrollTop = 0;
        }
      }, 50);
    }
    return () => clearInterval(scrollInterval);
  }, [isAutoScrolling]);

  const handleUserInteraction = () => {
    setIsAutoScrolling(false);
  };

  const toast = useToast();
  const [hasToastShown, setHasToastShown] = useState(false);
  useEffect(() => {
    if (findFilter.isYourPosts && allResults.length === 0 && !hasToastShown) {
      setHasToastShown(true);
      toast({
        title: 'Sorry, you have no posts.',
        description: "Click the blue plus icon on the map to create one now!",
        status: 'success',
        position: 'top',
        duration: 5000, // 5 seconds
        isClosable: true,
      })
    }
  }, [findFilter.isYourPosts, allResults, hasToastShown]);

  return (
    <Box
      paddingX="5px"
      width={{ base: "90vw", md: "21vw" }}
      height="80dvh"
      overflowY="scroll"
      overflowX="hidden"
      ref={resultsBarRef}
      onMouseEnter={handleUserInteraction}
      onWheel={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      {allResults.length > 0 ? viewableResults : noResults}
      {viewableResults.length < allResults.length && loadMoreButton}
    </Box>
  );
}