import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Text
} from '@chakra-ui/react';
import { VscCircleLargeOutline, VscClose } from 'react-icons/vsc';
import { RiScalesLine } from 'react-icons/ri';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Game,
  PlayerBot,
  PieceType,
  BoardType,
  PIECE,
  OUTCOME
} from './tictactoe';

type StatusType = 'initialized' | 'playing' | 'stop';
type ModeType = 'human' | 'bot';

function App() {
  const [size, setSize] = useState(3);
  const [status, setStatus] = useState<StatusType>('initialized');
  const [turnPiece, setTurnPiece] = useState<PieceType>('x');
  const [botPiece, setBotPiece] = useState<PieceType>('o');
  const [board, setBoard] = useState<BoardType>();
  const [mode, setMode] = useState<ModeType>('bot');
  const [stats, setStats] = useState({
    x: 0,
    o: 0,
    draw: 0
  });
  const [isBotTurn, setIsBotTurn] = useState(false);
  const [message, setMessage] = useState('');
  const game = useRef<Game>();
  const botPlayer = useRef<PlayerBot>();

  useEffect(() => {
    game.current = new Game(size);
    setBoard(game.current.getBoard());
  }, [size]);

  useEffect(() => {
    if (mode === 'bot') {
      botPlayer.current = new PlayerBot(botPiece);
    }
  }, [mode, botPiece]);

  const handleOutcome = useCallback((outcome: number) => {
    setStats((old) => ({
      x: outcome === OUTCOME.X_WINS ? old.x + 1 : old.x,
      o: outcome === OUTCOME.O_WINS ? old.o + 1 : old.o,
      draw: outcome === OUTCOME.DRAW ? old.draw + 1 : old.draw
    }));

    if (outcome === OUTCOME.X_WINS) {
      setMessage('X Wins!');
    } else if (outcome === OUTCOME.O_WINS) {
      setMessage('O WINS!');
    } else if (outcome === OUTCOME.DRAW) {
      setMessage("It's a tie");
    }
    setStatus('stop');
  }, []);

  useEffect(() => {
    if (
      game.current &&
      botPlayer.current &&
      isBotTurn &&
      status === 'playing'
    ) {
      const move = botPlayer.current?.placePiece(game.current);
      if (move) {
        game.current.placePiece(
          move[0],
          move[1],
          botPlayer.current?.getValue()
        );
        setBoard(game.current.getBoard());

        const outcome = game.current.getGameStatus();
        if (outcome !== OUTCOME.UNRESOLVED) {
          handleOutcome(outcome);
        }
      }
      setIsBotTurn(false);
    }
  }, [isBotTurn, status, handleOutcome]);

  const handleClickPlayStop = () => {
    if (status === 'initialized' || status === 'stop') {
      game.current = new Game(size);
      setMessage('');
      setBoard(game.current?.getBoard());
      setStatus('playing');
    } else if (status === 'playing') {
      setStatus('stop');
    }
  };

  const handleClickChangeSetting = () => {
    setStatus('initialized');
  };

  const handleClickPiece = (x: number, y: number) => {
    game.current?.placePiece(x, y, turnPiece);
    setBoard(game.current?.getBoard());

    const outcome = game.current?.getGameStatus();
    if (outcome && outcome !== OUTCOME.UNRESOLVED) {
      handleOutcome(outcome);
    } else {
      if (mode === 'human') {
        setTurnPiece((old) => (old === 'x' ? 'o' : 'x'));
      } else {
        setIsBotTurn(true);
      }
    }
  };

  return (
    <>
      <Box bg="orange.100" minH="100vh">
        <Box maxW="400px" mx="auto">
          <Heading as="h1" mb="4" pt="16" textAlign="center">
            Tic Tac Toe
          </Heading>
          <Box py="4" borderRadius="md" bg="white" shadow="md" mb="2">
            <Flex justify="space-evenly" align="center">
              <Box textAlign="center">
                <Icon
                  as={VscCircleLargeOutline}
                  lineHeight={1}
                  fontSize="24px"
                  color="blue.600"
                />
                <Text>
                  {stats.o} win{stats.o > 1 ? 's' : ''}
                </Text>
              </Box>
              <Box textAlign="center">
                <Icon
                  as={VscClose}
                  lineHeight={1}
                  fontSize="28px"
                  color="red.600"
                />
                <Text>
                  {stats.x} win{stats.x > 1 ? 's' : ''}
                </Text>
              </Box>
              <Box textAlign="center">
                <Icon
                  as={RiScalesLine}
                  lineHeight={1}
                  fontSize="28px"
                  color="yellow.600"
                />
                <Text>
                  {stats.draw} draw{stats.draw > 1 ? 's' : ''}
                </Text>
              </Box>
            </Flex>
          </Box>
          {status === 'initialized' && (
            <Box p="4" borderRadius="md" bg="white" shadow="md" mb="2">
              <Flex align="center" mb="3">
                <Text minW="120px">Board size</Text>
                <Box>
                  <NumberInput
                    value={size}
                    onChange={(_, newSize) => setSize(newSize)}
                    min={3}
                    max={6}
                  >
                    <NumberInputField bg="white" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Box>
              </Flex>
              <Flex>
                <Text minW="120px">Mode</Text>
                <RadioGroup
                  value={mode}
                  onChange={(newMode) => setMode(newMode as ModeType)}
                >
                  <Stack>
                    <Radio value="human">Human vs Human</Radio>
                    <Radio value="bot">Human vs Bot</Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
              {mode === 'bot' && (
                <Flex align="center" mt="3" mb="0">
                  <Text minW="120px">Piece</Text>
                  <Flex align="center">
                    <IconButton
                      mr="2"
                      icon={<VscClose />}
                      aria-label="Cross"
                      colorScheme="red"
                      fontSize="32px"
                      variant={botPiece === 'o' ? 'solid' : 'ghost'}
                      onClick={() => setBotPiece('o')}
                    />
                    <IconButton
                      icon={<VscCircleLargeOutline />}
                      aria-label="Circle"
                      variant={botPiece === 'x' ? 'solid' : 'ghost'}
                      colorScheme="blue"
                      fontSize="28px"
                      onClick={() => setBotPiece('x')}
                    />
                  </Flex>
                </Flex>
              )}
            </Box>
          )}
          <HStack>
            <Button
              isFullWidth
              colorScheme="orange"
              onClick={handleClickPlayStop}
            >
              {status === 'initialized'
                ? 'Play'
                : status === 'playing'
                ? 'Stop'
                : 'Restart'}
            </Button>
            {status === 'stop' && (
              <Button
                isFullWidth
                colorScheme="orange"
                variant="outline"
                onClick={handleClickChangeSetting}
              >
                Change Setting
              </Button>
            )}
          </HStack>
          {message && (
            <Box
              py="2"
              px="4"
              textAlign="center"
              mt="2"
              bg="yellow.500"
              borderRadius="md"
              color="white"
            >
              <Text>{message}</Text>
            </Box>
          )}
          {status !== 'initialized' && (
            <Box userSelect="none">
              {board?.map((rowPiece, rowIndex) => (
                <Flex
                  key={`rw-${rowIndex}`}
                  style={{ marginLeft: -8, marginRight: -8 }}
                >
                  {rowPiece.map((cellPiece, colIndex) => (
                    <Box
                      key={`row-${colIndex}-col-${rowIndex}`}
                      style={{ paddingLeft: 8, paddingRight: 8 }}
                      py="8px"
                      w="100%"
                      maxW={`${100 / size}%`}
                    >
                      <Box
                        as="button"
                        h={`${320 / size}px`}
                        bg="white"
                        shadow="md"
                        borderRadius="md"
                        cursor="pointer"
                        display="flex"
                        w="100%"
                        alignItems="center"
                        justifyContent="center"
                        transition="0.2s all ease"
                        transform="scale(1)"
                        disabled={
                          cellPiece !== PIECE.EMPTY || status !== 'playing'
                        }
                        onClick={() => handleClickPiece(rowIndex, colIndex)}
                        _hover={{
                          transform: 'scale(0.95)'
                        }}
                        _disabled={{
                          cursor: 'not-allowed'
                        }}
                      >
                        {cellPiece === 'o' && (
                          <Icon
                            as={VscCircleLargeOutline}
                            lineHeight={1}
                            fontSize="40px"
                            color="blue.600"
                          />
                        )}
                        {cellPiece === 'x' && (
                          <Icon
                            as={VscClose}
                            lineHeight={1}
                            fontSize="40px"
                            color="red.600"
                          />
                        )}
                        {cellPiece === PIECE.EMPTY && <>&nbsp;</>}
                      </Box>
                    </Box>
                  ))}
                </Flex>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default App;
