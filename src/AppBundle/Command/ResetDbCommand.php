<?php

namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ResetDbCommand extends ContainerAwareCommand
{
    /**
     * {@inheritdoc}
     */
    protected function configure()
    {
        $this
            ->setName('app:reset:db')
            ->setDescription('Reset database and load fixtures');
    }

    /**
     * {@inheritdoc}
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        // outputs multiple lines to the console (adding "\n" at the end of each line)
        $output->writeln([
            'Reseting Database',
            '=================',
            '',
        ]);

        $output->writeln([
            '',
            '1. Dropping Database',
            '====================',
            '',
        ]);
        $drop = $this->getApplication()->find('doctrine:database:drop');

        $dropArgs = array(
            'command' => 'doctrine:database:drop',
            '--force'  => true,
        );

        $dropInput = new ArrayInput($dropArgs);
        $dropReturnCode = $drop->run($dropInput, $output);

        $output->writeln([
            '',
            '2. Creating Database',
            '====================',
            '',
        ]);
        $create = $this->getApplication()->find('doctrine:database:create');

        $createArgs = array(
            'command' => 'doctrine:database:create',
        );

        $createInput = new ArrayInput($createArgs);
        $createReturnCode = $create->run($createInput, $output);

        $output->writeln([
            '',
            '3. Creating schema',
            '==================',
            '',
        ]);
        $update = $this->getApplication()->find('doctrine:schema:update');

        $updateArgs = array(
            'command' => 'doctrine:schema:update',
            '--force'  => true,
        );

        $updateInput = new ArrayInput($updateArgs);
        $updateReturnCode = $update->run($updateInput, $output);

        $output->writeln([
            '',
            '4. Loading Fixtures',
            '===================',
            '',
        ]);
        $fixtures = $this->getApplication()->find('doctrine:fixtures:load');

        $fixturesArgs = array(
            'command' => 'doctrine:fixtures:load',
        );

        $fixturesInput = new ArrayInput($fixturesArgs);
        $fixturesInput->setInteractive(false);
        $fixturesReturnCode = $fixtures->run($fixturesInput, $output);
    }
}
