<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CreateInterface extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:interface {interfaceName}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new interface class';

    /**
     * @const string service dir path
     */
    public const SERVICES_PATH = 'app/';

    /**
     * @var string
     */
    private $directoryPath = "";

    /**
     * @var string
     */
    private $namespace;

    /**
     * @var string
     */
    private $className;

    /**
     * @var string
     */
    private $interfaceName;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->setParameter();

        if (!$this->className) {
            $this->error('Interface Class Name invalid');

            return;
        }

        if (!$this->isExistsDirectory()) {
            $this->createDirectory();
        }

        if ($this->isExistFiles()) {
            $this->error('Interface already exist');

            return;
        }

        $this->createInterfaceClass();
        $this->info('Interface created successfully');
    }

    /**
     * Create interface
     *
     * @return void
     */
    public function createInterfaceClass(): void
    {
        $content = <<<EOD
        <?php

        namespace App{$this->namespace};

        interface {$this->className}
        {
            
        }
        EOD;

        file_put_contents($this->interfaceName, $content);
    }

    /**
     * To check if a interface file with the same name exists.
     *
     * @return bool
     */
    private function isExistFiles(): bool
    {
        return file_exists($this->interfaceName);
    }

    /**
     * To check if a interface directory with the same name exists.
     *
     * @return boolean
     */
    private function isExistsDirectory(): bool
    {
        return file_exists(self::SERVICES_PATH . $this->directoryPath);
    }

    /**
     * Create directory
     *
     * @return void
     */
    private function createDirectory(): void
    {
        mkdir(self::SERVICES_PATH . $this->directoryPath, 0755, true);
    }

    private function setParameter() {
        $interfaceName = $this->argument('interfaceName');
        if (Str::contains($interfaceName, '/')) {
            $this->directoryPath = Str::beforeLast($interfaceName, '/');
            $this->namespace = '\\' . str_replace('/', '\\', $this->directoryPath);
            $this->className = Str::afterLast($interfaceName, '/');
            $this->interfaceName = self::SERVICES_PATH . $interfaceName . '.php';
        } else {
            $this->className = $this->argument('interfaceName');
            $this->interfaceName = self::SERVICES_PATH . $interfaceName . '.php';
        }
    }
}
